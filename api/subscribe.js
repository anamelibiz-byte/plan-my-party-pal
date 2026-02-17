import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, source, partyData } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  let dbSuccess = false;
  let planId = null;

  // Save to database (Supabase)
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Save to subscribers table (for email list)
      const subscriberResponse = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          email,
          source: source || 'landing',
          party_data: partyData || null,
          created_at: new Date().toISOString(),
        }),
      });

      if (subscriberResponse.ok || subscriberResponse.status === 201) {
        dbSuccess = true;
      }

      // If this is from email gate with party data, also save to party_plans
      if (source === 'email_gate_step_1' && partyData) {
        const { data, error } = await supabase
          .from('party_plans')
          .insert({
            user_email: email,
            party_data: partyData
          })
          .select()
          .single();

        if (data && !error) {
          planId = data.id;
          console.log('✅ Party plan saved to database:', planId);
        } else if (error) {
          console.error('Party plans save error:', error);
        }
      }
    } catch (error) {
      console.error('Supabase save error:', error);
    }
  }

  // Send welcome email (Resend)
  if (resendKey && source === 'email_gate_step_1' && partyData?.childName) {
    try {
      const childName = partyData.childName;
      const welcomeHtml = `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="background: linear-gradient(135deg, #EC4899, #F43F5E); padding: 40px 24px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; font-size: 28px; margin: 0;">🎉 Welcome to Party Plann!</h1>
          </div>

          <div style="padding: 32px 24px; background: white;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 16px;">Hi there! 👋</p>

            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 16px;">
              Thank you for starting to plan <strong>${childName}'s party</strong> with us! You're on your way to creating an amazing celebration.
            </p>

            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 24px;">
              Here's what you can do next:
            </p>

            <div style="background: #FFF1F2; border-left: 4px solid #EC4899; padding: 16px; margin: 0 0 24px;">
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li style="margin-bottom: 8px;">Browse venue options near you</li>
                <li style="margin-bottom: 8px;">Choose from 50+ party themes</li>
                <li style="margin-bottom: 8px;">Pick activities perfect for ${childName}'s age</li>
                <li style="margin-bottom: 8px;">Get a custom shopping list with direct links</li>
                <li>Save everything and come back anytime</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://partyplann.com/app?email=${encodeURIComponent(email)}"
                 style="display: inline-block; background: linear-gradient(135deg, #EC4899, #F43F5E); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Continue Planning Your Party →
              </a>
            </div>

            <p style="font-size: 14px; color: #6B7280; line-height: 1.6; margin: 24px 0 0;">
              <strong>Pro Tip:</strong> Your party details are automatically saved and synced across devices. Click the button above to resume planning from anywhere!
            </p>

            <div style="background: linear-gradient(135deg, #FCE7F3, #FDF2F8); border-left: 6px solid #EC4899; padding: 20px; margin: 24px 0 0; border-radius: 8px;">
              <p style="font-size: 13px; color: #374151; margin: 0 0 12px; font-weight: 600; line-height: 1.4;">
                📬 <strong>Don't miss our tips!</strong>
              </p>
              <p style="font-size: 14px; color: #374151; margin: 0 0 12px; line-height: 1.6;">
                Add this to your contacts:
              </p>
              <p style="font-size: 14px; background: white; border: 2px solid #EC4899; color: #EC4899; padding: 10px; margin: 0 0 12px; border-radius: 6px; text-align: center; font-family: 'Courier New', monospace; font-weight: 600; word-break: break-all;">
                hello@go.partyplann.com
              </p>
              <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.5;">
                This prevents our emails from going to spam and you'll get helpful party planning tips.
              </p>
            </div>
          </div>

          <div style="padding: 24px; text-align: center; background: #F9FAFB; border-radius: 0 0 16px 16px; border-top: 1px solid #E5E7EB;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 8px;">
              You're receiving this because you started planning a party at Party Plann.
            </p>
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
              Questions? Reply to this email anytime! |
              <a href="https://partyplann.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #EC4899; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `;

      const welcomeText = `
Welcome to Party Plann! 🎉

Thank you for starting to plan ${childName}'s party with us! You're on your way to creating an amazing celebration.

Here's what you can do next:
• Browse venue options near you
• Choose from 50+ party themes
• Pick activities perfect for ${childName}'s age
• Get a custom shopping list with direct links
• Save everything and come back anytime

Continue planning your party: https://partyplann.com/app?email=${encodeURIComponent(email)}

Pro Tip: Your party details are automatically saved and synced across devices. Click the link above to resume planning from anywhere!

📬 Get all our updates: Add hello@go.partyplann.com to your contacts so our emails don't end up in spam. We'll send you helpful party planning tips and updates.

---
You're receiving this because you started planning a party at Party Plann.
Questions? Reply to this email anytime!
Unsubscribe: https://partyplann.com/unsubscribe?email=${encodeURIComponent(email)}
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Party Plann <hello@go.partyplann.com>',
          to: [email],
          subject: `🎉 Let's plan ${childName}'s perfect party!`,
          html: welcomeHtml,
          text: welcomeText,
        }),
      });
      // Don't fail the request if email fails - just log it
    } catch (error) {
      console.error('Welcome email error:', error);
    }
  }

  // Send free party planning checklist to landing page opt-ins
  if (resendKey && source === 'landing') {
    try {
      const checklistHtml = `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #EC4899, #F43F5E); padding: 40px 24px; border-radius: 16px 16px 0 0; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
            <h1 style="color: white; font-size: 28px; margin: 0 0 8px; font-weight: 800;">Your Free Party Planning Checklist!</h1>
            <p style="color: rgba(255,255,255,0.9); font-size: 15px; margin: 0;">Everything you need for an unforgettable party</p>
          </div>

          <!-- Intro -->
          <div style="padding: 32px 24px 0; background: white;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 8px;">Hi there! 👋</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 24px;">
              Here's your complete party planning checklist — organized by timeline so nothing falls through the cracks!
            </p>
          </div>

          <!-- 8 Weeks Out -->
          <div style="padding: 0 24px; background: white;">
            <div style="background: #FFF1F2; border-left: 5px solid #EC4899; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
              <h2 style="color: #BE185D; font-size: 17px; margin: 0 0 12px; font-weight: 700;">📅 8 Weeks Before the Party</h2>
              <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
                <li>Choose a date and time</li>
                <li>Set your budget</li>
                <li>Decide on indoor vs. outdoor venue</li>
                <li>Pick a party theme</li>
                <li>Make your guest list</li>
                <li>Book the venue (if renting a space)</li>
              </ul>
            </div>

            <!-- 4 Weeks Out -->
            <div style="background: #FDF4FF; border-left: 5px solid #A855F7; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
              <h2 style="color: #7E22CE; font-size: 17px; margin: 0 0 12px; font-weight: 700;">📬 4 Weeks Before the Party</h2>
              <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
                <li>Send invitations (digital or physical)</li>
                <li>Plan the menu — cake, food, snacks, drinks</li>
                <li>Order or plan the birthday cake</li>
                <li>Plan activities and entertainment</li>
                <li>Start your decorations shopping list</li>
                <li>Arrange party favors / goodie bags</li>
                <li>Hire entertainer or DJ if needed</li>
              </ul>
            </div>

            <!-- 2 Weeks Out -->
            <div style="background: #FFF7ED; border-left: 5px solid #F97316; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
              <h2 style="color: #C2410C; font-size: 17px; margin: 0 0 12px; font-weight: 700;">🛍️ 2 Weeks Before the Party</h2>
              <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
                <li>Confirm RSVPs and finalize headcount</li>
                <li>Order or purchase decorations</li>
                <li>Buy non-perishable food and supplies</li>
                <li>Prepare party favor bags</li>
                <li>Plan the day-of schedule (arrival, games, food, cake)</li>
                <li>Assign helpers or delegate tasks</li>
              </ul>
            </div>

            <!-- 1 Week Out -->
            <div style="background: #F0FDF4; border-left: 5px solid #22C55E; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
              <h2 style="color: #15803D; font-size: 17px; margin: 0 0 12px; font-weight: 700;">✅ 1 Week Before the Party</h2>
              <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
                <li>Confirm venue booking and vendors</li>
                <li>Shop for fresh food and drinks</li>
                <li>Wrap and label gifts if giving any</li>
                <li>Set up a photo area or backdrop</li>
                <li>Charge cameras, speakers, and any tech</li>
                <li>Send a reminder to guests</li>
                <li>Prep any DIY decorations or crafts</li>
              </ul>
            </div>

            <!-- Day Of -->
            <div style="background: linear-gradient(135deg, #FEF9C3, #FFF7ED); border-left: 5px solid #EAB308; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h2 style="color: #92400E; font-size: 17px; margin: 0 0 12px; font-weight: 700;">🎂 Day of the Party</h2>
              <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
                <li>Set up venue early (allow extra time!)</li>
                <li>Put out decorations and table settings</li>
                <li>Set up activity/game stations</li>
                <li>Pick up or prepare the cake</li>
                <li>Have a camera or phone ready to capture memories</li>
                <li>Greet guests as they arrive</li>
                <li>Enjoy every moment — you've got this! 🎉</li>
              </ul>
            </div>

            <!-- Pro Tips -->
            <div style="background: linear-gradient(135deg, #FCE7F3, #FDF2F8); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h2 style="color: #BE185D; font-size: 16px; margin: 0 0 12px; font-weight: 700;">💡 Pro Party Planning Tips</h2>
              <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.9; font-size: 14px;">
                <li><strong>Stick to your budget</strong> — Decide the total amount first, then divide by category.</li>
                <li><strong>Over-order food</strong> — It's always better to have too much than too little.</li>
                <li><strong>Plan 20% more time</strong> — Activities always take longer than expected.</li>
                <li><strong>Have a rain plan</strong> — Even for outdoor parties.</li>
                <li><strong>Keep favors simple</strong> — Kids love small, fun surprises over expensive gifts.</li>
                <li><strong>Take breaks</strong> — Make sure the birthday child gets a quiet moment too!</li>
              </ul>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 32px 0;">
              <p style="font-size: 16px; color: #374151; margin: 0 0 16px; font-weight: 600;">
                Ready to start planning? Our app does the heavy lifting for you!
              </p>
              <a href="https://partyplann.com/app"
                 style="display: inline-block; background: linear-gradient(135deg, #EC4899, #F43F5E); color: white; padding: 16px 36px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(236,72,153,0.35);">
                Start Planning for Free →
              </a>
              <p style="font-size: 13px; color: #9CA3AF; margin: 12px 0 0;">No account needed — start instantly</p>
            </div>

            <!-- What the app does -->
            <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="font-size: 14px; color: #6B7280; margin: 0 0 10px; font-weight: 600;">With Party Plann you also get:</p>
              <ul style="margin: 0; padding-left: 20px; color: #6B7280; font-size: 14px; line-height: 1.8;">
                <li>50+ party themes to choose from</li>
                <li>Venue finder with Google Maps</li>
                <li>Age-appropriate activity ideas</li>
                <li>Custom shopping list with product links</li>
                <li>Online RSVP manager</li>
                <li>Custom AI-generated birthday song 🎵</li>
              </ul>
            </div>

            <!-- Add to contacts -->
            <div style="background: linear-gradient(135deg, #FCE7F3, #FDF2F8); border-left: 6px solid #EC4899; padding: 20px; margin-bottom: 8px; border-radius: 8px;">
              <p style="font-size: 13px; color: #374151; margin: 0 0 8px; font-weight: 600;">
                📬 <strong>Don't miss our party tips!</strong>
              </p>
              <p style="font-size: 14px; color: #374151; margin: 0 0 10px; line-height: 1.6;">
                Add us to your contacts so our emails don't go to spam:
              </p>
              <p style="font-size: 14px; background: white; border: 2px solid #EC4899; color: #EC4899; padding: 10px; margin: 0; border-radius: 6px; text-align: center; font-family: 'Courier New', monospace; font-weight: 600;">
                hello@go.partyplann.com
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 24px; text-align: center; background: #F9FAFB; border-radius: 0 0 16px 16px; border-top: 1px solid #E5E7EB; margin-top: 8px;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 8px;">
              You're receiving this because you signed up for the free checklist at Party Plann.
            </p>
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
              Questions? Reply to this email anytime! |
              <a href="https://partyplann.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #EC4899; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>

        </div>
      `;

      const checklistText = `
Your Free Party Planning Checklist from Party Plann! 🎉

---

📅 8 WEEKS BEFORE THE PARTY
• Choose a date and time
• Set your budget
• Decide on indoor vs. outdoor venue
• Pick a party theme
• Make your guest list
• Book the venue (if renting a space)

📬 4 WEEKS BEFORE THE PARTY
• Send invitations (digital or physical)
• Plan the menu — cake, food, snacks, drinks
• Order or plan the birthday cake
• Plan activities and entertainment
• Start your decorations shopping list
• Arrange party favors / goodie bags
• Hire entertainer or DJ if needed

🛍️ 2 WEEKS BEFORE THE PARTY
• Confirm RSVPs and finalize headcount
• Order or purchase decorations
• Buy non-perishable food and supplies
• Prepare party favor bags
• Plan the day-of schedule (arrival, games, food, cake)
• Assign helpers or delegate tasks

✅ 1 WEEK BEFORE THE PARTY
• Confirm venue booking and vendors
• Shop for fresh food and drinks
• Wrap and label gifts if giving any
• Set up a photo area or backdrop
• Charge cameras, speakers, and any tech
• Send a reminder to guests
• Prep any DIY decorations or crafts

🎂 DAY OF THE PARTY
• Set up venue early (allow extra time!)
• Put out decorations and table settings
• Set up activity/game stations
• Pick up or prepare the cake
• Have a camera or phone ready to capture memories
• Greet guests as they arrive
• Enjoy every moment — you've got this!

---

💡 PRO TIPS
• Stick to your budget — decide the total first, then divide by category
• Over-order food — better too much than too little
• Plan 20% more time — activities always run long
• Have a rain plan — even for outdoor parties
• Keep favors simple — kids love small, fun surprises
• Take breaks — make sure the birthday child gets a quiet moment too!

---

Ready to start planning? Our free app handles themes, venues, activities, shopping lists, and more:
https://partyplann.com/app

---
You're receiving this because you signed up for the free checklist at Party Plann.
Questions? Reply to this email anytime!
Unsubscribe: https://partyplann.com/unsubscribe?email=${encodeURIComponent(email)}
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Party Plann <hello@go.partyplann.com>',
          to: [email],
          subject: '🎉 Your Free Party Planning Checklist is Here!',
          html: checklistHtml,
          text: checklistText,
        }),
      });
      console.log('✅ Checklist email sent to landing opt-in:', email);
    } catch (error) {
      console.error('Checklist email error:', error);
    }
  }

  // Always return success (frontend has fallback to localStorage)
  return res.status(200).json({
    success: true,
    storage: dbSuccess ? 'database' : 'local',
    emailSent: !!resendKey,
    planId: planId // Return plan ID for frontend to save
  });
}
