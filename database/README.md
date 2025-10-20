# Database Setup Guide

This directory contains database migration files for setting up your Supabase database.

## Setting Up Your Supabase Database

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization and set:
   - **Project Name**: molecular-nutrition-ai (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is fine for development

### 2. Get Your API Keys

Once your project is created:

1. Go to **Settings** > **API**
2. Copy the following values:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon public**: This is your `SUPABASE_ANON_KEY`
   - **service_role secret**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 3. Run the Database Migration

1. In your Supabase dashboard, go to the **SQL Editor**
2. Click **New Query**
3. Copy the contents of `migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the migration

This will create all the necessary tables, indexes, and Row Level Security policies.

### 4. Verify the Setup

After running the migration, verify that the following tables were created:

- `profiles`
- `meals`
- `biomarkers`
- `molecular_balance`
- `recommendations`

You can check this in the **Table Editor** section of your Supabase dashboard.

### 5. Configure Your Backend

Add your Supabase credentials to the backend `.env` file:

```env
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema Overview

### Tables

#### profiles
Stores user profile information including health goals, lifestyle preferences, and medical history.

#### meals
Stores user meal logs with nutrition data.

#### biomarkers
Stores lab test results and biomarker measurements.

#### molecular_balance
Stores calculated molecular balance scores over time.

#### recommendations
Stores AI-generated nutrition recommendations for users.

### Security

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data. The policies are automatically created by the migration script.

## Troubleshooting

### Migration Fails

If the migration fails:

1. Check if you have the UUID extension enabled:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

2. Make sure you're running the query as a superuser (service_role)

3. Check the error message in the Supabase SQL Editor

### Tables Not Appearing

If tables don't appear after migration:

1. Refresh the Supabase dashboard
2. Check the **Table Editor** section
3. Verify the migration ran without errors

## Additional Configuration

### Storage (Optional)

If you plan to add profile pictures or food images:

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket called `profiles` or `food-images`
3. Set appropriate access policies

### Authentication

Supabase Auth is already configured. You can customize:

1. **Email Templates**: Settings > Auth > Email Templates
2. **Providers**: Settings > Auth > Providers (Enable Google, Facebook, etc.)
3. **URL Configuration**: Settings > Auth > URL Configuration

## Maintenance

### Backups

Supabase automatically backs up your database daily on the free tier. For production:

1. Go to **Settings** > **Database**
2. Check **Backup** settings
3. Consider upgrading to Pro for point-in-time recovery

### Monitoring

Monitor your database usage:

1. Go to **Settings** > **Usage**
2. Check database size, API requests, and bandwidth
3. Set up alerts for quota limits

