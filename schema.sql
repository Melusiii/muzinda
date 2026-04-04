-- Muzinda Database Schema (Idempotent Version)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('student', 'landlord', 'provider')) NOT NULL,
    avatar_url TEXT,
    university TEXT,
    phone TEXT,
    gender TEXT CHECK (gender IN ('male', 'female', 'preferred_not_to_say')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('studio', 'shared', 'apartment')) NOT NULL,
    price DECIMAL NOT NULL,
    currency TEXT DEFAULT '$' NOT NULL,
    period TEXT DEFAULT 'month' NOT NULL,
    location TEXT NOT NULL,
    distance TEXT NOT NULL,
    image_url TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    verified BOOLEAN DEFAULT false NOT NULL,
    landlord_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    amenities TEXT[] DEFAULT '{}',
    total_rooms INTEGER NOT NULL,
    available_rooms INTEGER NOT NULL,
    occupancy_count INTEGER DEFAULT 0 NOT NULL,
    monthly_revenue DECIMAL DEFAULT 0 NOT NULL,
    gender_preference TEXT CHECK (gender_preference IN ('Male Only', 'Female Only', 'Mixed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'secured')) DEFAULT 'pending' NOT NULL,
    message TEXT,
    payment_status TEXT CHECK (payment_status IN ('paid', 'overdue', 'partial', 'pending')) DEFAULT 'pending' NOT NULL,
    amount_due DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price DECIMAL NOT NULL,
    experience_years INTEGER,
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    verified BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Maintenance Requests Table
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    issue_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'in_progress', 'resolved')) DEFAULT 'pending' NOT NULL,
    image_url TEXT,
    assigned_provider_id UUID REFERENCES public.services(id),
    starting_price DECIMAL,
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5b. Maintenance Bids Table
CREATE TABLE IF NOT EXISTS public.maintenance_bids (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES public.maintenance_requests(id) ON DELETE CASCADE NOT NULL,
    provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
    bid_amount DECIMAL NOT NULL,
    message TEXT,
    estimated_arrival TEXT, -- e.g. "30 mins", "Tomorrow morning"
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Bookings Table (Generic)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'service', etc.
    title TEXT NOT NULL,
    provider_name TEXT,
    date TEXT NOT NULL,
    price DECIMAL,
    status TEXT DEFAULT 'accepted' NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Transport System Tables
CREATE TABLE IF NOT EXISTS public.transport_routes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('bus', 'shuttle')) NOT NULL,
    price_morning DECIMAL NOT NULL,
    price_afternoon DECIMAL NOT NULL,
    pickup_points TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.transport_trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    route_id UUID REFERENCES public.transport_routes(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    vehicle_capacity INTEGER NOT NULL,
    departure_time TIME NOT NULL,
    trip_date DATE NOT NULL,
    status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(route_id, trip_date, departure_time)
);

CREATE TABLE IF NOT EXISTS public.transport_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.transport_trips(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    pickup_point TEXT NOT NULL,
    status TEXT CHECK (status IN ('booked', 'picked_up', 'no_show', 'cancelled')) DEFAULT 'booked' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(trip_id, student_id)
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'application', 'maintenance', 'payment', etc.
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 8. Helper Function to drop policies before recreating
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    
    DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;
    DROP POLICY IF EXISTS "Landlords can insert own properties" ON public.properties;
    DROP POLICY IF EXISTS "Landlords can update own properties" ON public.properties;
    DROP POLICY IF EXISTS "Landlords can delete own properties" ON public.properties;
    
    DROP POLICY IF EXISTS "Students can see own applications" ON public.applications;
    DROP POLICY IF EXISTS "Students can insert own applications" ON public.applications;
    DROP POLICY IF EXISTS "Students can update own applications" ON public.applications;
    DROP POLICY IF EXISTS "Landlords can see applications for their properties" ON public.applications;
    DROP POLICY IF EXISTS "Landlords can update application status" ON public.applications;

    DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
    DROP POLICY IF EXISTS "Providers can manage own services" ON public.services;

    DROP POLICY IF EXISTS "Students can see own maintenance requests" ON public.maintenance_requests;
    DROP POLICY IF EXISTS "Landlords can see maintenance requests for their properties" ON public.maintenance_requests;
    DROP POLICY IF EXISTS "Students can create maintenance requests" ON public.maintenance_requests;
    DROP POLICY IF EXISTS "Landlords can update maintenance status" ON public.maintenance_requests;
    DROP POLICY IF EXISTS "Students can update own maintenance requests" ON public.maintenance_requests;
    DROP POLICY IF EXISTS "Service providers can see marketplace jobs" ON public.maintenance_requests;
    DROP POLICY IF EXISTS "Service providers can see assigned jobs" ON public.maintenance_requests;
    DROP POLICY IF EXISTS "Service providers can update accepted jobs" ON public.maintenance_requests;

    DROP POLICY IF EXISTS "Users can see own bookings" ON public.bookings;
    DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

    DROP POLICY IF EXISTS "Transport routes viewable by everyone" ON public.transport_routes;
    
    DROP POLICY IF EXISTS "Transport trips viewable by everyone" ON public.transport_trips;
    DROP POLICY IF EXISTS "Drivers can update own trips" ON public.transport_trips;

    DROP POLICY IF EXISTS "Students can see own transport bookings" ON public.transport_bookings;
    DROP POLICY IF EXISTS "Drivers can see bookings for their trips" ON public.transport_bookings;
    DROP POLICY IF EXISTS "Students can create transport bookings" ON public.transport_bookings;
    DROP POLICY IF EXISTS "Students can update own transport bookings" ON public.transport_bookings;
    DROP POLICY IF EXISTS "Drivers can update bookings for their trips" ON public.transport_bookings;
    
    DROP POLICY IF EXISTS "Users can see own notifications" ON public.notifications;
    DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
    DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

    -- Reviews
    DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.reviews;
    DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;

    -- Favorites
    DROP POLICY IF EXISTS "Users can see own favorites" ON public.favorites;
    DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
    DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

    -- Maintenance Bids
    DROP POLICY IF EXISTS "Landlords can see bids for their requests" ON public.maintenance_bids;
    DROP POLICY IF EXISTS "Providers can see own bids" ON public.maintenance_bids;
    DROP POLICY IF EXISTS "Providers can insert own bids" ON public.maintenance_bids;
    DROP POLICY IF EXISTS "Providers can update own bids" ON public.maintenance_bids;
    DROP POLICY IF EXISTS "Landlords can update bid status" ON public.maintenance_bids;
END $$;

-- 9. Recreate Policies
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Properties
CREATE POLICY "Properties are viewable by everyone" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Landlords can insert own properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = landlord_id);
CREATE POLICY "Landlords can update own properties" ON public.properties FOR UPDATE USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can delete own properties" ON public.properties FOR DELETE USING (auth.uid() = landlord_id);

-- Applications
CREATE POLICY "Students can see own applications" ON public.applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own applications" ON public.applications FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Landlords can see applications for their properties" ON public.applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.properties 
        WHERE properties.id = applications.property_id 
        AND properties.landlord_id = auth.uid()
    )
);
CREATE POLICY "Landlords can update application status" ON public.applications FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.properties 
        WHERE properties.id = applications.property_id 
        AND properties.landlord_id = auth.uid()
    )
);

-- Services
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Providers can manage own services" ON public.services FOR ALL USING (auth.uid() = provider_id);

-- Maintenance Requests
CREATE POLICY "Students can see own maintenance requests" ON public.maintenance_requests FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Landlords can see maintenance requests for their properties" ON public.maintenance_requests FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.properties 
        WHERE properties.id = maintenance_requests.property_id 
        AND properties.landlord_id = auth.uid()
    )
);
CREATE POLICY "Students can create maintenance requests" ON public.maintenance_requests FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Landlords can update maintenance status" ON public.maintenance_requests FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.properties 
        WHERE properties.id = maintenance_requests.property_id 
        AND properties.landlord_id = auth.uid()
    )
);
CREATE POLICY "Students can update own maintenance requests" ON public.maintenance_requests FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Service providers can see marketplace jobs" ON public.maintenance_requests FOR SELECT USING (status = 'approved');
CREATE POLICY "Service providers can see assigned jobs" ON public.maintenance_requests FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.services 
        WHERE services.id = maintenance_requests.assigned_provider_id 
        AND services.provider_id = auth.uid()
    )
);
CREATE POLICY "Service providers can update accepted jobs" ON public.maintenance_requests FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.services 
        WHERE services.id = maintenance_requests.assigned_provider_id 
        AND services.provider_id = auth.uid()
    )
);

-- Bookings
CREATE POLICY "Users can see own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transport Routes
CREATE POLICY "Transport routes viewable by everyone" ON public.transport_routes FOR SELECT USING (true);

-- Transport Trips
CREATE POLICY "Transport trips viewable by everyone" ON public.transport_trips FOR SELECT USING (true);
CREATE POLICY "Drivers can update own trips" ON public.transport_trips FOR UPDATE USING (auth.uid() = driver_id);

-- Transport Bookings
CREATE POLICY "Students can see own transport bookings" ON public.transport_bookings FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Drivers can see bookings for their trips" ON public.transport_bookings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.transport_trips
        WHERE transport_trips.id = transport_bookings.trip_id
        AND transport_trips.driver_id = auth.uid()
    )
);
CREATE POLICY "Students can create transport bookings" ON public.transport_bookings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own transport bookings" ON public.transport_bookings FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Drivers can update bookings for their trips" ON public.transport_bookings FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.transport_trips
        WHERE transport_trips.id = transport_bookings.trip_id
        AND transport_trips.driver_id = auth.uid()
    )
);

-- Notifications
CREATE POLICY "Users can see own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- 10. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    target_id UUID NOT NULL,
    target_type TEXT CHECK (target_type IN ('property', 'provider')) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = author_id);

-- 11. Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, property_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- 12. Concurrency Control function for Transport Bookings
CREATE OR REPLACE FUNCTION public.book_transport_seat(
    p_trip_id UUID,
    p_pickup_point TEXT
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_trip_date DATE;
    v_capacity INTEGER;
    v_now TIMESTAMP WITH TIME ZONE;
    v_departure_time TIME;
    v_current_bookings INTEGER;
    v_booking_id UUID;
BEGIN
    v_now := timezone('utc'::text, now());

    -- Lock the trip row to prevent concurrent overbooking
    SELECT trip_date, vehicle_capacity, departure_time INTO v_trip_date, v_capacity, v_departure_time
    FROM public.transport_trips
    WHERE id = p_trip_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Trip not found.';
    END IF;

    -- Combine trip_date and departure_time into a full timestamp (assuming local time / timezone context)
    -- We convert v_now to the local date/time for direct comparison.
    -- Strict check: Is the current time past (departure_time - 15 minutes)?
    IF v_now > (v_trip_date + v_departure_time - interval '15 minutes') AT TIME ZONE 'UTC' THEN
        RAISE EXCEPTION 'Booking closed. We only accept bookings up to 15 minutes before departure.';
    END IF;

    -- Count active bookings
    SELECT count(*) INTO v_current_bookings
    FROM public.transport_bookings
    WHERE trip_id = p_trip_id AND status IN ('booked', 'picked_up');

    IF v_current_bookings >= v_capacity THEN
        RAISE EXCEPTION 'Trip is fully booked.';
    END IF;

    -- Insert the booking
    INSERT INTO public.transport_bookings (trip_id, student_id, pickup_point, status)
    VALUES (p_trip_id, auth.uid(), p_pickup_point, 'booked')
    RETURNING id INTO v_booking_id;

    RETURN jsonb_build_object('success', true, 'booking_id', v_booking_id);
EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'You have already booked a seat for this trip.';
END;
$$;

-- 14. Messages Table for Chat
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL, -- Optional: link to a property inquiry
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see messages they sent or received" ON public.messages 
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages they send" ON public.messages 
FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark messages they received as read" ON public.messages 
FOR UPDATE USING (auth.uid() = receiver_id);

-- Drop policies for messages table if they exist helper (already added via standard naming)
-- DO $$ BEGIN DROP ... END $$; -- Not strictly needed if using IF NOT EXISTS and fresh policies
