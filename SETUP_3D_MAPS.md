# 3D Maps Setup for Manipal University Jaipur

## Prerequisites
1. Google Cloud Console account
2. Billing enabled on your Google Cloud project

## Step 1: Install Dependencies
Run the installation script:
```bash
npm install react-native-webview @types/react-native-webview
```

## Step 2: Google Cloud Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Street View Static API
   - Places API (optional)
   - Maps SDK for Android (for Android builds)
   - Maps SDK for iOS (for iOS builds)

## Step 3: Create API Key
1. Go to "Credentials" in Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. Restrict the API key:
   - Application restrictions: Choose appropriate option
   - API restrictions: Select the APIs you enabled

## Step 4: Configure API Key
1. Open `.env` file in project root
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

## Step 5: Update LocationModal Component
1. Open `components/map/LocationModal.tsx`
2. Replace `YOUR_API_KEY_HERE` with your actual API key on line 15:
   ```typescript
   const GOOGLE_API_KEY = 'your_actual_api_key_here';
   ```

## Step 6: Android Configuration (if building for Android)
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="your_actual_api_key_here"/>
```

## Step 7: iOS Configuration (if building for iOS)
Add to `ios/YourApp/AppDelegate.m`:
```objc
#import <GoogleMaps/GoogleMaps.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"your_actual_api_key_here"];
  // ... rest of your code
}
```

## Features Included
- ✅ 3D Street View integration
- ✅ Manipal University Jaipur campus locations
- ✅ Custom map styling
- ✅ Satellite/Standard map toggle
- ✅ 3D building visualization
- ✅ Interactive markers with detailed modals

## Usage
1. Tap on any campus location marker
2. In the location modal, tap "3D View" button
3. Explore the 3D Street View of the location
4. Use the map type toggle (layers icon) to switch between standard and satellite view

## Troubleshooting
- If Street View doesn't load, check your API key and internet connection
- If maps appear blank, ensure Google Maps APIs are enabled
- For build issues, check platform-specific configurations above