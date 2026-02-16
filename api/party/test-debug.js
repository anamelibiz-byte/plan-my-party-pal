import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {},
    supabaseTest: {},
    databaseTest: {}
  };

  // 1. Check environment variables
  diagnostics.environment.hasSupabaseUrl = !!process.env.SUPABASE_URL;
  diagnostics.environment.hasSupabaseKey = !!process.env.SUPABASE_ANON_KEY;
  diagnostics.environment.supabaseUrlValue = process.env.SUPABASE_URL || 'MISSING';

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    diagnostics.error = 'Environment variables not configured';
    return res.status(200).json(diagnostics);
  }

  // 2. Test Supabase connection
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    diagnostics.supabaseTest.connected = true;

    // 3. Test party_plans table structure
    const { data: tableTest, error: tableError } = await supabase
      .from('party_plans')
      .select('id, party_name, status, is_deleted')
      .limit(1);

    if (tableError) {
      diagnostics.databaseTest.error = tableError.message;
      diagnostics.databaseTest.code = tableError.code;
      diagnostics.databaseTest.details = tableError.details;
      diagnostics.databaseTest.hint = tableError.hint;
    } else {
      diagnostics.databaseTest.success = true;
      diagnostics.databaseTest.columns = tableTest && tableTest.length > 0
        ? Object.keys(tableTest[0])
        : 'No rows found';
    }

    // 4. Test insert capability (then immediately delete)
    const testEmail = `test-${Date.now()}@debug.com`;
    const { data: insertData, error: insertError } = await supabase
      .from('party_plans')
      .insert({
        user_email: testEmail,
        party_data: { test: true },
        party_name: 'Debug Test',
        status: 'active',
        is_deleted: false
      })
      .select()
      .single();

    if (insertError) {
      diagnostics.insertTest = {
        success: false,
        error: insertError.message,
        code: insertError.code,
        hint: insertError.hint
      };
    } else {
      diagnostics.insertTest = {
        success: true,
        id: insertData.id
      };

      // Clean up test record
      await supabase
        .from('party_plans')
        .delete()
        .eq('id', insertData.id);
    }

  } catch (error) {
    diagnostics.supabaseTest.error = error.message;
    diagnostics.supabaseTest.stack = error.stack;
  }

  return res.status(200).json(diagnostics);
}
