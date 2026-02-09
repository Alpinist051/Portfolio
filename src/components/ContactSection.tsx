import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key (replace with your actual key)
// emailjs.init("YOUR_PUBLIC_KEY_HERE");

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    from: "",
    message: "",
  });
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        source: formData.from,
        message: formData.message,
        reply_to: formData.email,
        to_name: "Your Name", // Replace with your name
      };

      // Send email using EmailJS
      // Replace these IDs with your actual EmailJS IDs
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,      // Note the VITE_ prefix
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!       // Also use VITE_ here
      );

      toast({
        title: "Message Transmitted Successfully!",
        description: "Your message has been sent. I'll respond shortly.",
      });

      // Reset form
      setFormData({ name: "", email: "", subject: "", from: "", message: "" });
      setIsSelectFocused(false);
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: "Transmission Failed",
        description: "Failed to send message. Please try again or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectFocus = () => {
    setIsSelectFocused(true);
  };

  const handleSelectBlur = () => {
    setIsSelectFocused(false);
  };

  return (
    <section id="contact" className="relative py-32" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 space-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          {/* Icon */}
          <div className="mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-foreground"
            >
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>

          {/* Vertical line */}
          <div className="mb-4 h-8 w-px bg-foreground/60" />

          {/* Title with watermark effect */}
          <div className="relative">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-5xl font-bold uppercase tracking-widest text-muted/30 md:text-7xl">
              CONTACT
            </span>
            <h2 className="relative z-10 font-display text-3xl font-bold tracking-wider text-foreground md:text-4xl">
              Contact
            </h2>
          </div>

          <p className="mx-auto mt-6 max-w-2xl font-body text-muted-foreground">
            Ready to build something extraordinary together.
          </p>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="relative rounded-xl border border-border bg-card/50 p-8 backdrop-blur-sm md:p-10"
          >
            {/* Decorative corners */}
            <div className="absolute left-4 top-4 h-4 w-4 border-l-2 border-t-2 border-primary" />
            <div className="absolute right-4 top-4 h-4 w-4 border-r-2 border-t-2 border-primary" />
            <div className="absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-primary" />

            <div className="grid gap-6 md:grid-cols-2">
              {/* Name field */}
              <div className="group relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="peer w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder=" "
                />
                <label className="pointer-events-none absolute left-4 top-3 font-body text-sm text-muted-foreground transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs">
                  Your Name
                </label>
              </div>

              {/* Email field */}
              <div className="group relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="peer w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder=" "
                />
                <label className="pointer-events-none absolute left-4 top-3 font-body text-sm text-muted-foreground transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs">
                  Email Address
                </label>
              </div>
            </div>

            {/* Subject and Where From fields */}
            <div className="grid gap-6 md:grid-cols-2 mt-6">
              {/* Subject field */}
              <div className="group relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="peer w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder=" "
                />
                <label className="pointer-events-none absolute left-4 top-3 font-body text-sm text-muted-foreground transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs">
                  Subject
                </label>
              </div>

              {/* Where From field - Updated with state-based floating label */}
              <div className="group relative">
                <select
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  onFocus={handleSelectFocus}
                  onBlur={handleSelectBlur}
                  required
                  className="peer w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                >
                  <option value="" disabled hidden></option>
                  <option value="Upwork">Upwork</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Dice">Dice</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Others">Others</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-colors
                  ${isSelectFocused ? 'text-primary' : 'text-muted-foreground'}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                {/* Floating label for select */}
                <label className={`pointer-events-none absolute left-4 font-body transition-all
                  ${formData.from || isSelectFocused
                    ? '-top-6 text-xs text-primary'
                    : 'top-3 text-sm text-muted-foreground'
                  }`}>
                  Where From
                </label>
              </div>
            </div>

            {/* Message field */}
            <div className="group relative mt-6">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="peer w-full resize-none rounded-lg border border-border bg-background px-4 py-3 font-body text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder=" "
              />
              <label className="pointer-events-none absolute left-4 top-3 font-body text-sm text-muted-foreground transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs">
                Your Message
              </label>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative mt-8 w-full overflow-hidden rounded-lg bg-primary py-4 font-display text-sm font-semibold tracking-wider text-primary-foreground transition-all hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
                    />
                    TRANSMITTING...
                  </>
                ) : (
                  <>
                    SEND MESSAGE
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent transition-transform group-hover:translate-x-full" />
            </motion.button>
          </motion.form>

          {/* Alternative contact info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-8 text-center"
          >
            <div>
              <span className="font-body text-xs tracking-wider text-muted-foreground">
                EMAIL
              </span>
              <p className="font-body text-sm text-foreground">contact@developer.ai</p>
            </div>
            <div>
              <span className="font-body text-xs tracking-wider text-muted-foreground">
                LOCATION
              </span>
              <p className="font-body text-sm text-foreground">Remote / Worldwide</p>
            </div>
            <div>
              <span className="font-body text-xs tracking-wider text-muted-foreground">
                AVAILABILITY
              </span>
              <p className="font-body text-sm text-primary">Open for Projects</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;