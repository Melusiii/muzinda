-- Muzinda Seed Data (Fully Automated)
-- This version automatically finds an existing landlord in your database.
-- NO MANUAL ID COPYING REQUIRED!

-- 1. Create Sample Properties for the first landlord found
DO $$
DECLARE
    v_landlord_id UUID;
BEGIN
    -- Automatically find the most recent landlord profile
    SELECT id INTO v_landlord_id FROM public.profiles WHERE role = 'landlord' ORDER BY created_at DESC LIMIT 1;
    
    IF v_landlord_id IS NULL THEN
        RAISE EXCEPTION 'NO LANDLORD FOUND. Please sign up as a LANDLORD in the app first, then run this again!';
    ELSE
        RAISE NOTICE 'Using landlord ID: %', v_landlord_id;

        -- Insert properties using the found ID
        INSERT INTO public.properties (
            id, title, type, price, currency, period, location, distance, 
            image_url, images, verified, landlord_id, description, 
            amenities, total_rooms, available_rooms, occupancy_count, monthly_revenue
        ) VALUES
        (
            gen_random_uuid(), 
            '11th Boarding House', 
            'hostel', 
            160, 
            '$', 
            'month', 
            'Greenside', 
            '10 mins from AU', 
            'https://images.unsplash.com/photo-1555854817-40e098ee79bd?q=80&w=2074&auto=format&fit=crop',
            ARRAY['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop'],
            true,
            v_landlord_id,
            'A vibrant community for students. The 11th Boarding House offers unmatched amenities, including secure parking and high-speed Wi-Fi, making it a favorite among Africa University students.',
            ARRAY['Security', 'Study Room', 'Water Tanks', 'WiFi'],
            20,
            2,
            18,
            3200
        ),
        (
            gen_random_uuid(), 
            'Mr Munyam', 
            'apartment', 
            220, 
            '$', 
            'month', 
            'Morningside', 
            '8 mins from AU', 
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop',
            ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074&auto=format&fit=crop'],
            true,
            v_landlord_id,
            'Premium residential experience by Mr Munyam. Exceptionally maintained complex with dedicated student services and immediate maintenance response. Very highly rated.',
            ARRAY['Privacy', 'Garden', 'Solar', 'Security'],
            15,
            3,
            12,
            3300
        ),
        (
            gen_random_uuid(), 
            'Mountain View Cottages', 
            'studio', 
            250, 
            '$', 
            'month', 
            'Chikanga', 
            '15 mins from AU', 
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop',
            ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'],
            true,
            v_landlord_id,
            'Private cottages in a quiet neighborhood. Perfect for PG and final year students requiring deep focus.',
            ARRAY['Privacy', 'Garden', 'Borehole', 'Fiber'],
            6,
            1,
            5,
            1250
        );
    END IF;
END $$;

-- 2. Add Some Transportation Routes
INSERT INTO public.transport_routes (id, name, type, price_morning, price_afternoon, pickup_points, active)
VALUES
(gen_random_uuid(), 'Chikanga to AU Campus', 'bus', 1.5, 2.0, ARRAY['Chikanga Terminus', 'Opposite Spar', 'AU Gate'], true),
(gen_random_uuid(), 'Fairview Shuttle', 'shuttle', 2.0, 2.0, ARRAY['Fairview Park', 'Main Road Intersection', 'AU Administration'], true)
ON CONFLICT (id) DO NOTHING;
