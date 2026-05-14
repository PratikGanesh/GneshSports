'use client';

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-text-main mb-4">Contact & Inquiries</h1>
          <p className="text-lg text-text-muted">
            Interested in bulk orders, specific catalogs, or quoting? Reach out to our sales team instantly.
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-accent shadow-sm overflow-hidden flex flex-col md:flex-row">
          
          {/* Direct Contact Info */}
          <div className="bg-primary text-white p-8 md:w-1/3 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="ml-4">
                    <p className="text-sm text-white/70 uppercase tracking-wider mb-1">Phone</p>
                    <a href="tel:+919925387218" className="text-lg font-semibold hover:underline">
                      +91 99253 87218
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="ml-4">
                    <p className="text-sm text-white/70 uppercase tracking-wider mb-1">Store Address</p>
                    <p className="text-base">Kothi Rd, opp. S.S.G HOSPITAL,<br/>Near SSG Hospital, Anandpura,<br/>Vadodara, Gujarat 390001, India</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="ml-4">
                    <p className="text-sm text-white/70 uppercase tracking-wider mb-1">Store Hours</p>
                    <p className="text-base">Mon - Sun: 10:30 AM – 8:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="p-8 md:w-2/3">
            <h3 className="text-2xl font-bold text-text-main mb-6">Send a Message</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully! Our team will contact you shortly.'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-main">First Name</label>
                  <input type="text" id="name" required className="mt-1 block w-full rounded-md border-accent shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border" />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-text-main">Company (Optional)</label>
                  <input type="text" id="company" className="mt-1 block w-full rounded-md border-accent shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-main">Email</label>
                <input type="email" id="email" required className="mt-1 block w-full rounded-md border-accent shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border" />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-main">Subject / Product Inquiry</label>
                <input type="text" id="subject" placeholder="e.g. Bulk Order for Nivia Footballs" required className="mt-1 block w-full rounded-md border-accent shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-main">Message</label>
                <textarea id="message" rows={4} required className="mt-1 block w-full rounded-md border-accent shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"></textarea>
              </div>

              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                Submit Inquiry
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
