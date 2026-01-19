-- Step 1: Insert Tony Stark into the account table
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@stark.com',
        'Iam1ronM@n'
    );
-- Step 2: Update Tony Stark's account type to Admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Step 3: Delete Tony Stark from the account table
DELETE FROM public.account
WHERE account_id = 1;
-- Step 4: Update GM Hummer description using REPLACE()
-- Note: Make sure the text matches exactly what exists in your data ("small interior" vs "small interiors")
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interior',
        'a huge interior'
    )
WHERE inv_id = 10;
-- Step 5: Inner join to show vehicles in the Sport classification
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- Step 6: Update all image paths to include /vehicles
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
-- Step 7: Select all vehicles to verify image path updates