import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  businessName: string;
  businessEmail: string;
  serviceName: string;
  staffName: string;
  startTime: Date;
  endTime: Date;
}

export async function sendBookingConfirmationToCustomer(
  data: BookingEmailData
) {
  const dateStr = data.startTime.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = data.startTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTimeStr = data.endTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@pagenest.uk",
      to: data.customerEmail,
      subject: `Booking Confirmed – ${data.businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Booking Confirmed!</h2>
          <p>Hi ${data.customerName},</p>
          <p>Your booking at <strong>${data.businessName}</strong> has been confirmed.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Service:</strong> ${data.serviceName}</p>
            <p><strong>With:</strong> ${data.staffName}</p>
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Time:</strong> ${timeStr} – ${endTimeStr}</p>
          </div>
          <p>If you need to cancel or reschedule, please contact us directly.</p>
          <p>See you soon!</p>
          <p style="color: #888; font-size: 12px;">Powered by PageNest</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send customer confirmation email:", error);
  }
}

export async function sendBookingNotificationToOwner(data: BookingEmailData) {
  const dateStr = data.startTime.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = data.startTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTimeStr = data.endTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@pagenest.uk",
      to: data.businessEmail,
      subject: `New Booking – ${data.customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">New Booking Received</h2>
          <p>You have a new booking at <strong>${data.businessName}</strong>.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Customer:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>Service:</strong> ${data.serviceName}</p>
            <p><strong>Staff:</strong> ${data.staffName}</p>
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Time:</strong> ${timeStr} – ${endTimeStr}</p>
          </div>
          <p>Log in to your dashboard to manage this booking.</p>
          <p style="color: #888; font-size: 12px;">Powered by PageNest</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send owner notification email:", error);
  }
}
