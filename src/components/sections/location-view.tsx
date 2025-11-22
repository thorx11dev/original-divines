'use client';

export const LocationView = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-[20px] md:px-[40px] pt-[120px] pb-[40px]">
        <div className="mb-[40px]">
          <h1 className="text-[32px] md:text-[40px] font-bold text-foreground leading-tight uppercase">
            Our Location
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px]">
          {/* Address Information */}
          <div className="p-[32px] bg-white rounded-lg border border-border">
            <h2 className="text-[24px] font-bold text-foreground uppercase mb-[24px]">
              Address
            </h2>
            
            <div className="space-y-[20px]">
              <div>
                <div className="text-10px font-bold text-grey-40 uppercase mb-[8px]">
                  Full Address
                </div>
                <div className="text-[16px] text-foreground leading-relaxed">
                  78F9+6F5, Jhang Sadar Amir Colony<br />
                  Jhang<br />
                  Pakistan
                </div>
              </div>

              <div>
                <div className="text-10px font-bold text-grey-40 uppercase mb-[8px]">
                  Opening Hours
                </div>
                <div className="text-[16px] text-foreground leading-relaxed">
                  Saturday: 1:00 PM - 12:00 AM<br />
                  Sunday: 1:00 PM - 4:00 AM<br />
                  Monday: 1:00 PM - 12:00 AM<br />
                  Tuesday: 1:00 PM - 12:00 AM<br />
                  Wednesday: 1:00 PM - 12:00 AM<br />
                  Thursday: 1:00 PM - 12:00 AM<br />
                  Friday: 1:00 PM - 12:00 AM
                </div>
              </div>

              <div>
                <div className="text-10px font-bold text-grey-40 uppercase mb-[8px]">
                  Price Range
                </div>
                <div className="text-[16px] text-foreground leading-relaxed">
                  Rs 1-1,000 per person
                </div>
              </div>

              <div>
                <div className="text-10px font-bold text-grey-40 uppercase mb-[8px]">
                  Contact
                </div>
                <div className="text-[16px] text-foreground leading-relaxed">
                  Email: divinespk1@gmail.com<br />
                  Phone: 0314 3300991
                </div>
              </div>

              <div className="pt-[24px] border-t border-border">
                <a
                  href="https://maps.app.goo.gl/nMAqSyaYoiqCWtYg7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full h-[52px] bg-primary text-primary-foreground text-12px font-bold uppercase rounded-lg hover:opacity-90 transition-opacity"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="relative h-[500px] lg:h-full min-h-[400px] rounded-lg overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.8573572842624!2d72.31854!3d31.270833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39226fd0fc8e0001%3A0x1234567890abcdef!2s78F9%2B6F5%2C%20Jhang%20Sadar%20Amir%20Colony%2C%20Jhang%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            />
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-[40px] p-[32px] bg-white rounded-lg border border-border">
          <h2 className="text-[24px] font-bold text-foreground uppercase mb-[16px]">
            How to Find Us
          </h2>
          <div className="space-y-[12px] text-[16px] text-foreground leading-relaxed">
            <p>
              Our location is in Jhang Sadar Amir Colony, easily accessible from the main city center.
            </p>
            <div className="pt-[16px]">
              <div className="text-10px font-bold text-grey-40 uppercase mb-[8px]">
                Getting Here
              </div>
              <p>
                Located in the heart of Jhang, we're easily accessible by car, taxi, or rickshaw. 
                Use the Google Maps link above for precise directions from your current location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};