export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const elevenKey = process.env.ELEVENLABS_API_KEY;
  if (!elevenKey) return res.status(500).json({ error: 'ElevenLabs not configured' });

  const {
    childName, age, gender, traits, extraTraits,
    accomplishment, loves, musicStyle, vibe, singerGender, email
  } = req.body || {};

  if (!childName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // ── Build the prompt ────────────────────────────────────────────────────────
  const pronouns = gender === 'boy' ? 'he/him' : gender === 'girl' ? 'she/her' : 'they/them';
  const traitList = traits && traits.length > 0 ? traits.join(', ') : 'wonderful and special';
  const vibeMap = {
    'happy': 'upbeat, joyful, and celebratory',
    'sweet': 'warm, heartfelt, and emotional',
    'silly': 'fun, playful, and silly',
  };
  const styleMap = {
    'pop': 'catchy pop',
    'country': 'warm country',
    'rnb': 'smooth R&B',
    'rock': 'fun rock',
    'reggae': 'feel-good reggae',
    'classical': 'elegant classical',
  };
  const singerMap = {
    'female': 'female vocalist',
    'male': 'male vocalist',
    'duet': 'male and female duet',
  };

  const prompt = [
    `A ${vibeMap[vibe] || 'joyful'} ${styleMap[musicStyle] || 'pop'} birthday song performed by a ${singerMap[singerGender] || 'female vocalist'}.`,
    `The song is for ${childName}, who is turning ${age || 'a year older'} today (${pronouns}).`,
    loves ? `${childName} loves ${loves}.` : '',
    accomplishment ? `This year, ${childName} ${accomplishment}.` : '',
    traitList ? `${childName} is ${traitList}.` : '',
    extraTraits ? `${extraTraits}.` : '',
    `The song should include "Happy Birthday" in the lyrics, mention ${childName} by name multiple times, and feel like a special celebration just for them.`,
    `Keep the energy ${vibeMap[vibe] || 'upbeat'} throughout. Professional quality, full song with intro, verse, chorus, and outro.`,
  ].filter(Boolean).join(' ');

  console.log('🎵 Generating song with prompt:', prompt.substring(0, 100) + '...');

  try {
    // ── Call ElevenLabs Music API ────────────────────────────────────────────
    const elevenRes = await fetch('https://api.elevenlabs.io/v1/music', {
      method: 'POST',
      headers: {
        'xi-api-key': elevenKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        prompt,
        music_length_ms: 150000, // 2.5 minutes
        model_id: 'music_v1',
      }),
    });

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error('ElevenLabs error:', elevenRes.status, errText);
      return res.status(500).json({ error: 'Song generation failed. Please try again.' });
    }

    // ── Convert binary MP3 to base64 ─────────────────────────────────────────
    const audioBuffer = await elevenRes.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

    console.log('✅ Song generated, size:', audioBuffer.byteLength, 'bytes');

    // ── Email the song to the user via Resend (with MP3 attachment) ──────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && email) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
          body: JSON.stringify({
            from: 'Party Plann <hello@go.partyplann.com>',
            to: [email],
            subject: `🎵 ${childName}'s Custom Birthday Song is Ready!`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(to right, #ec4899, #f43f5e); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 8px;">🎵</div>
                  <h1 style="color: white; margin: 0; font-size: 26px;">${childName}'s Song is Ready!</h1>
                </div>
                <div style="padding: 32px; background: white; border-radius: 0 0 12px 12px; border: 1px solid #f0f0f0;">
                  <p style="font-size: 16px; color: #333;">We've created a one-of-a-kind birthday song just for <strong>${childName}</strong>! 🎂</p>
                  <p style="color: #555;">Your personalized <strong>${styleMap[musicStyle] || 'birthday'} song</strong> is attached to this email as an MP3 file. Just open the attachment to listen or save it to your device!</p>
                  <div style="background: #fdf2f8; border: 1px solid #fce7f3; border-radius: 12px; padding: 16px; margin: 24px 0; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #be185d;"><strong>📎 ${childName}-birthday-song.mp3</strong> is attached below</p>
                    <p style="margin: 8px 0 0; font-size: 13px; color: #9d174d;">Open it to play, or save it to your phone/computer to keep forever!</p>
                  </div>
                  <p style="color: #888; font-size: 13px; margin-top: 24px;">Thank you for using Party Plann! We hope ${childName} loves their special song. 🎉</p>
                  <p style="color: #888; font-size: 13px;">— The Party Plann Team<br><a href="https://partyplann.com" style="color: #ec4899;">partyplann.com</a></p>
                </div>
              </div>
            `,
            attachments: [
              {
                filename: `${childName.toLowerCase().replace(/\s+/g, '-')}-birthday-song.mp3`,
                content: base64Audio,
                content_type: 'audio/mpeg',
              },
            ],
          }),
        });
        console.log('✅ Song email with attachment sent to:', email);
      } catch (emailErr) {
        console.error('Email send failed (non-fatal):', emailErr);
      }
    }

    // ── Return audio to frontend ──────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      audioDataUrl,
      childName,
      musicStyle,
      email,
    });

  } catch (err) {
    console.error('generate-song error:', err);
    return res.status(500).json({ error: 'Something went wrong generating the song. Please try again.' });
  }
}
