import type { NewsletterSection } from './emailTemplate';

export interface PrebuiltSection extends NewsletterSection {
  /** Display name in the import picker */
  label: string;
  /** Brief description shown under the label */
  description: string;
}

export const prebuiltSections: PrebuiltSection[] = [
  {
    label: 'Upcoming Board Meeting',
    description: 'Monthly board meeting announcement with Zoom link',
    imageUrl: 'https://mcusercontent.com/36a8ff8dbf13061f9d722226f/images/435c2e0c-ce23-fe85-7c85-5259c9d82d6e.jpg',
    header: 'Upcoming Board Meeting',
    subheader: '[DATE], 9:00 AM',
    body: `<a href="https://us06web.zoom.us/j/83570622575?pwd=O8onTd8zzuPudT1JXjyHs80KKIQsoc.1" target="_blank">Join on Zoom</a><br><br>FAHA's Board of Directors usually meets at 9 a.m. on the 3rd Sunday of the month (except July and December).<br><br>Meetings are always on Zoom and there are usually at least a few Board members in person sitting in the FAHA Library. Any FAHA member in good standing is welcome to attend either in person or on Zoom (the meeting host will need to identify you prior to logging you into the meeting)!<br><br>Member questions about Board activities are also welcome via <a href="mailto:Directors@fahausa.org">Directors@fahausa.org</a>`,
  },
  {
    label: 'Donate to FAHA',
    description: 'Donation request with PayPal link and QR code',
    imageUrl: 'https://gallery.mailchimp.com/36a8ff8dbf13061f9d722226f/images/ed1989da-d3d7-4ad0-893e-ddd0ca2fb5af.jpg',
    header: 'Donate to FAHA Anytime',
    subheader: '',
    body: `FAHA makes a special request at the year's end, but you can make a donation any time! Making a gift in honor of a birthday, anniversary or other special event is an especially nice way to mark the day for a FAHA friend who has everything.<br><br><a href="https://www.paypal.com/donate?campaign_id=VW245VZFBY5RS" target="_blank">Donate through our PayPal Campaign Page</a> or use our QR code:<br><br><img src="https://mcusercontent.com/36a8ff8dbf13061f9d722226f/images/1023b2e1-8ddf-332a-82ce-af8707491349.png" width="128" height="128" style="float:right;" alt="Donate QR Code"><br>Reminder! Annual Membership Fees are now due.<br><br><a href="https://www.paypal.com/ncp/payment/ZZ5RUZWRAL9W2" target="_blank">Click here to pay your annual FAHA Member Fees</a>`,
  },
  {
    label: 'Mindful Meditation',
    description: 'Weekly meditation sessions at FAHA Library',
    imageUrl: 'https://mcusercontent.com/36a8ff8dbf13061f9d722226f/images/b9a1b3b3-3e1f-c06c-5ba1-51b5337706b4.png',
    header: 'Join Us for Mindful Meditation at the FAHA Library',
    subheader: 'Every Tuesday and Saturday from 10:45 AM to 12:00 PM',
    body: `Take a peaceful break in your week and recharge with our guided Mindful Meditation classes. All FAHA members and residents are warmly welcome—whether you're new to meditation or a longtime practitioner, this is a wonderful space to relax, breathe, and connect.<br><br>For more information, feel free to reach out to Jatta:<br>📧 <a href="mailto:tikigardens123@gmail.com">tikigardens123@gmail.com</a><br>📞 415-713-0341<br><br>We hope to see you there! ✨`,
  },
  {
    label: 'Finnish Language Lessons',
    description: 'Weekly beginner Finnish lessons at FAHA Library',
    imageUrl: 'https://mcusercontent.com/36a8ff8dbf13061f9d722226f/images/e6ece71d-2017-76d2-a3df-2280c511e19a.jpg',
    header: 'Beginning Finnish Language Lessons',
    subheader: 'Join us Every Week',
    body: `Ready to start learning Finnish? Join us for weekly beginner-friendly lessons—open to all FAHA members and residents!<br><br>Thursdays at 11 AM – FAHA Library<br><br>📧 <a href="mailto:tikigardens123@gmail.com">tikigardens123@gmail.com</a><br>📞 415-713-0341`,
  },
  {
    label: 'Empty Section',
    description: 'Blank section to fill in from scratch',
    imageUrl: '',
    header: '',
    subheader: '',
    body: '',
  },
];
