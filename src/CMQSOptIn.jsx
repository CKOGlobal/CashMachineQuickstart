import { useState } from 'react';

export default function CMQSOptIn() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nonPromotional: false,
    marketing: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#07090F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#0F1419',
          border: '1px solid #1F2937',
          borderRadius: '8px',
          padding: '40px',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#C9A84C', marginBottom: '20px', fontSize: '24px' }}>
            ✓ You're All Set!
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: '1.6' }}>
            Your Cash Machine QuickStart accountability coaching is activated. 
            You'll receive your first check-in message soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07090F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0F1419',
        border: '1px solid #1F2937',
        borderRadius: '8px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%'
      }}>
        <img 
          src="/cash_machine_image.png" 
          alt="Cash Machine QuickStart"
          style={{
            width: '100%',
            maxWidth: '500px',
            marginBottom: '30px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        />

        <h1 style={{ 
          color: '#C9A84C', 
          marginBottom: '10px',
          fontSize: '28px',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800
        }}>
          Activate Your Coaching
        </h1>
        
        <p style={{ 
          color: '#9CA3AF', 
          marginBottom: '30px',
          fontSize: '16px',
          lineHeight: '1.6'
        }}>
          Complete your Cash Machine QuickStart setup to receive your 90-day accountability plan and SMS check-ins.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#E5E7EB', marginBottom: '8px', fontSize: '14px' }}>
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '4px',
                color: '#E5E7EB',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#E5E7EB', marginBottom: '8px', fontSize: '14px' }}>
              Last Name *
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '4px',
                color: '#E5E7EB',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#E5E7EB', marginBottom: '8px', fontSize: '14px' }}>
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '4px',
                color: '#E5E7EB',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', color: '#E5E7EB', marginBottom: '8px', fontSize: '14px' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="(555) 555-5555"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '4px',
                color: '#E5E7EB',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{
            background: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '4px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#C9A84C', fontWeight: 600, marginBottom: '15px', fontSize: '14px' }}>
              SMS Message Preferences (Optional)
            </p>

            <label style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              marginBottom: '15px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={formData.nonPromotional}
                onChange={(e) => setFormData({...formData, nonPromotional: e.target.checked})}
                style={{ 
                  marginRight: '10px', 
                  marginTop: '4px',
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ color: '#D1D5DB', fontSize: '13px', lineHeight: '1.5' }}>
                <strong>NON-PROMOTIONAL MESSAGES:</strong> I consent to receive transactional and service-related messages from CKO Global INC (account updates, accountability check-ins, progress tracking, and program-related notifications) at the phone number provided. Message frequency may vary. Message & data rates may apply. Reply HELP for help or STOP to opt-out.
              </span>
            </label>

            <label style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={formData.marketing}
                onChange={(e) => setFormData({...formData, marketing: e.target.checked})}
                style={{ 
                  marginRight: '10px', 
                  marginTop: '4px',
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ color: '#D1D5DB', fontSize: '13px', lineHeight: '1.5' }}>
                <strong>MARKETING & PROMOTIONAL MESSAGES:</strong> I consent to receive marketing, promotional, and sales messages from CKO Global INC (special offers, new programs, and promotional content) at the phone number provided. Message frequency may vary. Message & data rates may apply. Reply HELP for help or STOP to opt-out.
              </span>
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#C9A84C',
              color: '#07090F',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#E8C870'}
            onMouseOut={(e) => e.target.style.background = '#C9A84C'}
          >
            Activate My Coaching
          </button>

          <div style={{ 
            marginTop: '20px', 
            paddingTop: '20px', 
            borderTop: '1px solid #374151',
            textAlign: 'center'
          }}>
            <p style={{ color: '#C9A84C', fontSize: '14px', marginBottom: '10px', fontWeight: 600 }}>
              Cash Machine QuickStart
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '5px' }}>
              CKO Global INC
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '5px' }}>
              Email: Kelli@proactively-lazy.com
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '15px' }}>
              Website: cash-machine-quickstart.vercel.app
            </p>
            <p style={{ color: '#6B7280', fontSize: '12px', lineHeight: '1.6' }}>
              By submitting this form, you agree to our{' '}
              <a href="/privacy.html" style={{ color: '#C9A84C', textDecoration: 'none' }}>Privacy Policy</a>
              {' '}and{' '}
              <a href="/terms.html" style={{ color: '#C9A84C', textDecoration: 'none' }}>Terms of Service</a>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
