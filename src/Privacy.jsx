export default function Privacy() {
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
          Privacy Policy
        </h1>
        
        <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '30px' }}>
          Last Updated: March 31, 2026
        </p>
        <div style={{ color: '#E5E7EB', lineHeight: '1.8', fontSize: '16px' }}>
          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Data Collection
          </h2>
          <p style={{ marginBottom: '20px' }}>
            We collect your name, email address, and mobile phone number when you sign up for SMS updates 
            through Cash Machine QuickStart.
          </p>
          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Data Usage
          </h2>
          <p style={{ marginBottom: '20px' }}>
            We use your data solely for sending accountability check-ins, progress reminders, and coaching 
            support related to the Cash Machine QuickStart program. We may also send occasional promotional 
            messages if you have opted in to receive marketing communications.
          </p>
          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Data Security
          </h2>
          <p style={{ marginBottom: '20px' }}>
            We protect your data through encryption and secure storage measures to prevent unauthorized access.
          </p>
          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Data Retention
          </h2>
          <p style={{ marginBottom: '20px' }}>
            We retain your information as long as you are subscribed to our SMS service. You may request 
            deletion at any time by replying STOP to any message or contacting us directly.
          </p>
          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Opt-In
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Reply with YES to receive updates from CKO Global INC.
          </p>
          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Opt-Out
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Reply STOP to any message to unsubscribe from our SMS list. After unsubscribing, we will remove 
            your number from our list within 24 hours.
          </p>
          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Non-Sharing Clause
          </h2>
          <p style={{ marginBottom: '20px' }}>
            No mobile information will be shared with third parties/affiliates for marketing/promotional 
            purposes. Information sharing to subcontractors in support services, such as customer service, 
            is permitted. All other use case categories exclude text messaging originator opt-in data and 
            consent; this information will not be shared with any third parties.
          </p>
          <h2 style={{ color: '#C9A84C', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
            Contact Us
          </h2>
          <p style={{ marginBottom: '20px' }}>
            If you have questions about this Privacy Policy, please contact us at: kelli@proactively-lazy.com
          </p>
        </div>
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #374151' }}>
          <a href="/cmqs-opt-in" style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Opt-In Form
          </a>
        </div>
      </div>
    </div>
  );
}
