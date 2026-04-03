export default function Terms() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#07090F',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: '#0F1419',
        border: '1px solid #1F2937',
        borderRadius: '8px',
        padding: '40px'
      }}>
        <h1 style={{ 
          color: '#C9A84C', 
          marginBottom: '30px',
          fontSize: '32px',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800
        }}>
          Terms of Service
        </h1>
        
        <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '30px' }}>
          Last Updated: April 3, 2026
        </p>

        <div style={{ color: '#E5E7EB', lineHeight: '1.8', fontSize: '16px' }}>

          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '0', marginBottom: '15px' }}>
            Age Restriction (18+)
          </h2>
          <p style={{ marginBottom: '20px' }}>
            You must be at least <strong>18 years of age</strong> to use Cash Machine QuickStart or opt in to receive SMS messages from CKO Global LLC. This program is intended solely for adults aged 18 and older. By enrolling and submitting your information, you represent and warrant that you are 18 years of age or older. We do not knowingly collect personal information from or send SMS messages to anyone under the age of 18. If we discover that a person under 18 has enrolled, we will immediately terminate their access, cancel their enrollment, and delete their data.
          </p>

          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            SMS Program Terms
          </h2>
          <p style={{ marginBottom: '20px' }}>
            By opting in to receive SMS messages from Cash Machine QuickStart, you agree to receive accountability check-ins, progress reminders, and coaching support messages from <strong>CKO Global LLC</strong> (Cash Machine QuickStart), operated by Kelli Owens.
          </p>

          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Description of SMS Program &amp; Messaging Use Cases
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Cash Machine QuickStart uses SMS messaging to deliver a 90-day accountability coaching experience. Messages sent through this program include:
          </p>
          <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Accountability check-ins (Mon, Wed, Fri) asking where you are in your plan</li>
            <li style={{ marginBottom: '8px' }}>Progress reminders and milestone celebrations</li>
            <li style={{ marginBottom: '8px' }}>Program support notifications and coaching prompts</li>
            <li style={{ marginBottom: '8px' }}>Transactional messages related to your enrollment and plan</li>
          </ul>
          <p style={{ marginBottom: '20px' }}>
            This is a transactional and service-related SMS program. We do not use this SMS channel for third-party advertising or unrelated promotional messages.
          </p>

          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Message Frequency
          </h2>
          <p style={{ marginBottom: '20px' }}>
            You will receive up to 3 messages per week for 90 days (approximately 36 messages total). Message frequency may vary based on your progress and participation in the program.
          </p>

          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Disclosures for Message and Data Rates
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Message and data rates may apply for any messages sent to you from us and to us from you. If you have questions about your text plan or data plan, contact your wireless provider. Standard carrier rates apply.
          </p>

          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Instructions to Opt Out — Text STOP
          </h2>
          <p style={{ marginBottom: '20px' }}>
            You can cancel the SMS service at any time by replying <strong>STOP</strong> to any message. After you send STOP, we will send you a final confirmation SMS and you will no longer receive messages from us. If you want to rejoin, simply sign up again and messaging will resume.
          </p>

          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Support Contact Information
          </h2>
          <p style={{ marginBottom: '20px' }}>
            If you are experiencing issues with the messaging program, reply <strong>HELP</strong> to any message for assistance, or contact us directly at{' '}
            <a href="mailto:kelli@proactively-lazy.com" style={{ color: '#C9A84C', textDecoration: 'none' }}>kelli@proactively-lazy.com</a>
            {' '}or visit{' '}
            <a href="https://proactively-lazy.com" style={{ color: '#C9A84C', textDecoration: 'none' }}>proactively-lazy.com</a>.
          </p>

          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Carrier Liability Disclaimer
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Carriers are not liable for delayed or undelivered messages. Message delivery depends on your carrier and network conditions, which are outside our control.
          </p>

          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Links to Privacy Policy
          </h2>
          <p style={{ marginBottom: '20px' }}>
            If you have any questions regarding privacy or how we handle your data, please read our full{' '}
            <a href="/privacy" style={{ color: '#C9A84C', textDecoration: 'underline' }}>Privacy Policy</a>.
            Your use of this service constitutes acceptance of both these Terms of Service and our Privacy Policy.
          </p>

        </div>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #374151' }}>
          <a href="/" style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Cash Machine QuickStart
          </a>
        </div>
      </div>
    </div>
  );
}
