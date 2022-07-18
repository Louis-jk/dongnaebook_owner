package com.dmonster.dongnaebookowner;

import android.content.ContentResolver;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Bundle; // 스플래시 이미지
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // 스플래시 이미지
import android.os.Build;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import com.rnfs.RNFSPackage; // react-native-fs

import androidx.core.app.NotificationCompat;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage; // react-native-push-notification

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.SplashScreenTheme);
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          // 채널 01 (1회 알림)
          NotificationChannel notificationChannel01 = new NotificationChannel("dongnaebookowner01", "Order Alarm01", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel01.setShowBadge(true);
          notificationChannel01.setDescription("");
          AudioAttributes att01 = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel01.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/ohjoo_sound_1"), att01);
          notificationChannel01.enableVibration(true);
          notificationChannel01.setVibrationPattern(new long[]{400, 400});
          notificationChannel01.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager01 = getSystemService(NotificationManager.class);
          manager01.createNotificationChannel(notificationChannel01);

          // 채널 02 (2회 알림)
          NotificationChannel notificationChannel02 = new NotificationChannel("dongnaebookowner02", "Order Alarm02", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel02.setShowBadge(true);
          notificationChannel02.setDescription("");
          AudioAttributes att02 = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel02.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/ohjoo_sound_2"), att02);
          notificationChannel02.enableVibration(true);
          notificationChannel02.setVibrationPattern(new long[]{400, 400});
          notificationChannel02.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager02 = getSystemService(NotificationManager.class);
          manager02.createNotificationChannel(notificationChannel02);

          // 채널 03 (3회 알림)
          NotificationChannel notificationChannel03 = new NotificationChannel("dongnaebookowner03", "Order Alarm03", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel03.setShowBadge(true);
          notificationChannel03.setDescription("");
          AudioAttributes att03 = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel03.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/ohjoo_sound_3"), att03);
          notificationChannel03.enableVibration(true);
          notificationChannel03.setVibrationPattern(new long[]{400, 400});
          notificationChannel03.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager03 = getSystemService(NotificationManager.class);
          manager03.createNotificationChannel(notificationChannel03);
      }
    }
    
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ohjoostore";
  }
}
