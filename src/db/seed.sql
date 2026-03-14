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

## Upstairs Family Unit

Furnished 3 bedroom, 2 bathroom apartment with kitchen, dishes, linens, and laundry facilities. Sleeps 6 (8 with sleeping bags). Includes sauna and pool access.

- **$250 / night** *(Minimum 2 nights)*

## Camping

Camp on the FAHA grounds. Contact the office to reserve your spot and confirm availability.

- **$20 / night**');

-- Seed sample events
INSERT INTO events (title, slug, description, date_start, time_start, time_end, location, image_url, ticket_price, published) VALUES
('Juhannus – Midsummer Celebration', 'juhannus-midsummer-celebration-2026', 'Join us for our annual Midsummer festival featuring a traditional bonfire, Finnish folk music, dancing around the maypole, and a potluck dinner under the longest day of the year.', '2026-06-20', '2:00 PM', '10:00 PM', 'FAHA, 197 W. Verano Avenue, Sonoma, CA 95476', '/assets/images/container01.jpg', '$25 Members / $40 Guests', 1),
('Sauna & Swim Social', 'sauna-swim-social-2026', 'A casual evening for members and guests to enjoy the saunas and pool together. Light refreshments provided.', '2026-05-09', '4:00 PM', '8:00 PM', 'FAHA, 197 W. Verano Avenue, Sonoma, CA 95476', '/assets/images/container05.jpg', 'Free for Members', 1),
('Finnish Language Workshop', 'finnish-language-workshop-2026', 'Learn everyday Finnish phrases and explore the beauty of the Finnish language in this beginner-friendly workshop led by native speakers.', '2026-04-26', '10:00 AM', '12:00 PM', 'FAHA, 197 W. Verano Avenue, Sonoma, CA 95476', '/assets/images/container06.jpg', '$15', 1);
