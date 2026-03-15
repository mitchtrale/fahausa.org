-- Mock site content for local development
INSERT INTO site_content (section_key, label, content) VALUES
('membership_pricing', 'Membership Pricing', '## Annual Member Fees

- **Adult Annual Fee:** $80
- **Children under 13:** Free

## New Member Fees

*One time fees paid at the time of application, refunded if application is not approved.*

- **Family Membership:** $500 + Annual Fee
- **Single Membership:** $300 + Annual Fee'),

('membership_description', 'Membership Description', 'Our members gain access to many amenities at FAHA, including our authentic saunas, heated pool, discounts on guest rooms, special events, and more. Members may bring guests to FAHA for sauna and pool, and must pay a fair day use fee for each guest.

FAHA has lasted as long as it has through the contributions of its members and volunteers. If you would like to support and join FAHA, you must apply for an individual or family membership. You need not have Finnish or Nordic heritage to join, but you do need to be willing to contribute to FAHA as a volunteer in some way.'),

('sauna_hours', 'Sauna Hours', '## Summer, May – October

- Wednesdays, 4–7 PM
- Saturdays, 1–7 PM
- Sundays, 1–7 PM

## Winter, November – April

- Wednesdays, 4–6 PM
- Saturdays, 1–6 PM

*Guests may only use saunas when accompanied by an active Member.*'),

('sauna_pricing', 'Sauna Pricing', '## Sauna Fees

- **Members:** Free
- **Guest Adult:** $20
- **Guest Child:** $5

## Private Sauna

- **Member & up to 6 guests:** $30 / hr'),

('pool_hours', 'Pool Hours', '## Summer, May – October

- Wednesdays, 4–7 PM
- Saturdays, 1–7 PM
- Sundays, 1–7 PM

## Winter, November – April

- Wednesdays, 4–6 PM
- Saturdays, 1–6 PM'),

('pool_info', 'Pool Info', 'FAHA members enjoy access to an eight foot deep pool, with a classic diving board. There is generally no lifeguard on duty, though we do hire one for some Summer events.

We offer dressing rooms and bathrooms, sun umbrellas, chaise lounges, tables, chairs, and grass around the patio. There are often communal pool toys available for use.

- **Members:** Free
- **Guests:** Included with Sauna'),

('event_rentals', 'Event Rentals', 'FAHA''s beautiful buildings and grounds are available for rent. We love hosting weddings, parties, meetings, work retreats, family reunions, and other private events.

## Grand Event Hall

Our facilities include a large Hall with hardwood floors and soaring ceilings, featuring a modern audio system with microphones, a stage, tables and chairs for 100, and a kitchen built for hosting big parties.

## Bar & Snack Bar

Our bars look out onto our covered outdoor dining area through large windows, and feature refrigerators, sinks, stove, oven, microwave, and additional seating.

## Gazebo

A beautiful outdoor covered space perfect for ceremonies, receptions, and gatherings surrounded by the FAHA grounds.'),

('overnight_stays', 'Overnight Stays', 'FAHA offers a variety of accommodations for short-term stays.

## 6 Guest Rooms

Featuring 2 twin beds and full bathroom. *1 room sleeps 4, with bunk bed.*

- **Members:** $100 / night
- **Guests:** $150 / night

## Camping

Camp on the FAHA grounds. Contact the office to reserve your spot and confirm availability.

- **$20 / night**'),

('donate_heading', 'Donate Heading', 'Donate to FAHA'),

('donate_blurb', 'Donate Text', 'FAHA is a nonprofit organization sustained by the generosity of our community. Your donation helps us maintain our historic buildings, keep our saunas and pool running, and host cultural events that bring people together. Every contribution, large or small, makes a difference.'),

('donate_url', 'Donate URL', 'https://www.paypal.com/donate');

-- Mock upcoming events for local development
-- Uses dates relative to "today" so they always appear as upcoming
INSERT INTO events (title, slug, description, date_start, time_start, time_end, location, image_url, ticket_price, published) VALUES
('Sauna Saturday',
 'sauna-saturday',
 'Open sauna day for members and guests. Towels not provided. Enjoy the authentic Finnish sauna experience followed by a refreshing dip in the pool.',
 date('now', '+3 days'), '13:00', '19:00',
 'FAHA, 197 W. Verano Avenue, Sonoma, CA 95476',
 '/assets/images/container05.jpg',
 'Members free / Guests $20',
 true),

('Finnish Language Circle',
 'finnish-language-circle',
 'Casual conversation group for Finnish language learners at all levels. Native speakers welcome! Coffee and pulla provided.',
 date('now', '+5 days'), '10:00', '11:30',
 'FAHA Library',
 '/assets/images/container06.jpg',
 'Free',
 true),

('Board Meeting',
 'board-meeting',
 'Monthly FAHA Board of Directors meeting. Open to all members. New membership applications will be reviewed.',
 date('now', '+10 days'), '18:00', '20:00',
 'FAHA Event Hall',
 NULL,
 NULL,
 true),

('Midsummer Celebration (Juhannus)',
 'midsummer-celebration-juhannus',
 'Join us for our annual Midsummer celebration! Traditional Finnish festivities including bonfire, music, dancing around the maypole, and a potluck dinner. Bring a dish to share.',
 date('now', '+21 days'), '16:00', '22:00',
 'FAHA Grounds',
 '/assets/images/container01.jpg',
 'Members $10 / Guests $25',
 true),

('Pool Party & BBQ',
 'pool-party-bbq',
 'Summer pool party for the whole family. BBQ burgers, hot dogs, and veggie options provided. BYOB. Kids welcome — lifeguard on duty.',
 date('now', '+28 days'), '12:00', '17:00',
 'FAHA Pool & Patio',
 '/assets/images/container09.jpg',
 'Members $5 / Guests $15',
 true),

('Finnish Film Night',
 'finnish-film-night',
 'Screening of a classic Finnish film with English subtitles. Popcorn and refreshments provided. Discussion to follow.',
 date('now', '+35 days'), '19:00', '21:30',
 'FAHA Event Hall',
 NULL,
 'Free',
 true),

('Craft Workshop: Traditional Finnish Weaving',
 'craft-workshop-finnish-weaving',
 'Learn the basics of traditional Finnish textile weaving. All materials provided. Beginners welcome. Space limited to 12 participants.',
 date('now', '+42 days'), '10:00', '14:00',
 'FAHA Library',
 NULL,
 '$15 materials fee',
 true),

('Annual General Meeting',
 'annual-general-meeting',
 'Annual meeting for all FAHA members. Board elections, financial review, and planning for the year ahead. Your voice matters — please attend!',
 date('now', '+60 days'), '17:00', '19:00',
 'FAHA Event Hall',
 NULL,
 NULL,
 true);
