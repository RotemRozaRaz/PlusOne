import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - Plus One',
  description: 'Privacy Policy for Plus One',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-ivory py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="font-display text-4xl text-slate-800 mb-8">Privacy Policy</h1>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-6">
          <section>
            <h2 className="font-display text-2xl text-slate-800 mt-8 mb-3">1. Introduction</h2>
            <p>
              Welcome to Plus One ("we", "us", "our" or "Company"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and mobile application.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-800 mt-8 mb-3">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Device Information:</strong> We collect a unique device identifier to track your account across sessions.</li>
              <li><strong>Profile Information:</strong> Information you provide when creating your profile (name, photos, preferences, etc.).</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform (matches, swipes, messages).</li>
              <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-800 mt-8 mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Facilitate connections between users</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about updates and features</li>
              <li>Analyze usage patterns to improve our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-800 mt-8 mb-3">4. Cookies and Tracking</h2>
            <p>
              We use cookies to remember your preferences and improve your experience on our platform. When you click "Accept" on our cookies banner, you consent to the use of cookies as described in this policy.
            </p>
            <p>
              You can control cookies through your browser settings. However, disabling cookies may impact the functionality of our service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-800 mt-8 mb-3">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-800 mt-8 mb-3">6. Third-Party Services</h2>
            <p>
              Our platform uses Supabase for data storage and authentication. Please refer to their privacy policy for information on how they handle your data. We may also use other third-party services to enhance our platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-800 mt-8 mb-3">7. User Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of certain data uses</li>
            </ul>
            <p>To exercise these rights, please contact us at the information provided below.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-800 mt-8 mb-3">8. Children's Privacy</h2>
            <p>
              Plus One is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete such information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-800 mt-8 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by updating the date of this policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-800 mt-8 mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at your earliest convenience.
            </p>
          </section>

          <div className="text-sm text-slate-600 mt-8 pt-6 border-t border-slate-300">
            <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
