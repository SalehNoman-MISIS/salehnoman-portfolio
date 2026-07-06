import testimonials from "@/content/testimonials.json";

export const testimonialsContent = testimonials;

/** Only reviews that aren't marked as placeholders are shown on the live site. */
export const liveTestimonials = testimonials.items.filter(
  (t) => !("placeholder" in t && (t as { placeholder?: boolean }).placeholder),
);
