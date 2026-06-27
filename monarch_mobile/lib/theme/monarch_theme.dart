import 'package:flutter/material.dart';

class MonarchColors {
  static const Color black = Color(0xFF050506);
  static const Color voidBlack = Color(0xFF09090B);
  static const Color ink = Color(0xFF10131A);
  static const Color surface = Color(0xFF12141B);
  static const Color surfaceStrong = Color(0xFF191C25);
  static const Color surfaceMuted = Color(0xFF242935);
  static const Color glass = Color(0x24FFFFFF);
  static const Color glassStrong = Color(0x33FFFFFF);
  static const Color stroke = Color(0x33FFFFFF);
  static const Color strokeStrong = Color(0x4DD7BF7E);
  static const Color gold = Color(0xFFD0AA63);
  static const Color goldSoft = Color(0xFFF0D59B);
  static const Color blue = Color(0xFF8FB4FF);
  static const Color mint = Color(0xFF8DE0BE);
  static const Color rose = Color(0xFFE5A0A9);
  static const Color text = Color(0xFFFBF7EF);
  static const Color muted = Color(0xFFB7B4AD);
  static const Color success = Color(0xFF7AD7A7);
  static const Color warning = Color(0xFFE6BE6F);
  static const Color danger = Color(0xFFFF8D88);
}

ThemeData buildMonarchTheme() {
  const scheme = ColorScheme.dark(
    primary: MonarchColors.gold,
    secondary: MonarchColors.blue,
    tertiary: MonarchColors.mint,
    surface: MonarchColors.surface,
    error: MonarchColors.danger,
    onPrimary: MonarchColors.black,
    onSecondary: MonarchColors.black,
    onTertiary: MonarchColors.black,
    onSurface: MonarchColors.text,
    onError: MonarchColors.black,
  );

  final base = ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: MonarchColors.black,
    canvasColor: Colors.transparent,
    dividerColor: MonarchColors.stroke,
    splashFactory: InkSparkle.splashFactory,
    visualDensity: VisualDensity.adaptivePlatformDensity,
    pageTransitionsTheme: const PageTransitionsTheme(
      builders: {
        TargetPlatform.android: CupertinoPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        TargetPlatform.macOS: CupertinoPageTransitionsBuilder(),
        TargetPlatform.windows: CupertinoPageTransitionsBuilder(),
        TargetPlatform.linux: CupertinoPageTransitionsBuilder(),
        TargetPlatform.fuchsia: CupertinoPageTransitionsBuilder(),
      },
    ),
  );

  final roundedRectangle = RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(20),
  );

  return base.copyWith(
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      foregroundColor: MonarchColors.text,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
      iconTheme: IconThemeData(color: MonarchColors.goldSoft),
      actionsIconTheme: IconThemeData(color: MonarchColors.goldSoft),
      titleTextStyle: TextStyle(
        color: MonarchColors.text,
        fontSize: 18,
        height: 1.1,
        fontWeight: FontWeight.w700,
        letterSpacing: 0,
      ),
    ),
    textTheme: base.textTheme.copyWith(
      headlineLarge: const TextStyle(
        fontSize: 34,
        fontWeight: FontWeight.w800,
        color: MonarchColors.text,
        height: 1.05,
        letterSpacing: 0,
      ),
      headlineMedium: const TextStyle(
        fontSize: 26,
        fontWeight: FontWeight.w800,
        color: MonarchColors.text,
        height: 1.1,
        letterSpacing: 0,
      ),
      titleLarge: const TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        color: MonarchColors.text,
        height: 1.18,
        letterSpacing: 0,
      ),
      titleMedium: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w700,
        color: MonarchColors.text,
        height: 1.25,
        letterSpacing: 0,
      ),
      bodyLarge: const TextStyle(
        fontSize: 16,
        height: 1.45,
        color: MonarchColors.text,
        letterSpacing: 0,
      ),
      bodyMedium: const TextStyle(
        fontSize: 14,
        height: 1.45,
        color: MonarchColors.text,
        letterSpacing: 0,
      ),
      bodySmall: const TextStyle(
        fontSize: 12,
        height: 1.35,
        color: MonarchColors.muted,
        letterSpacing: 0,
      ),
      labelLarge: const TextStyle(
        fontSize: 13,
        letterSpacing: 0,
        fontWeight: FontWeight.w700,
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      height: 68,
      elevation: 0,
      backgroundColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      indicatorColor: MonarchColors.gold.withValues(alpha: 0.20),
      labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return TextStyle(
          color: selected ? MonarchColors.goldSoft : MonarchColors.muted,
          fontSize: 11,
          height: 1,
          fontWeight: selected ? FontWeight.w800 : FontWeight.w600,
          letterSpacing: 0,
        );
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return IconThemeData(
          color: selected ? MonarchColors.goldSoft : MonarchColors.muted,
          size: selected ? 25 : 23,
        );
      }),
    ),
    tabBarTheme: const TabBarThemeData(
      dividerColor: Colors.transparent,
      indicatorColor: MonarchColors.gold,
      labelColor: MonarchColors.goldSoft,
      unselectedLabelColor: MonarchColors.muted,
      indicatorSize: TabBarIndicatorSize.tab,
      labelStyle: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 0),
      unselectedLabelStyle: TextStyle(
        fontWeight: FontWeight.w600,
        letterSpacing: 0,
      ),
    ),
    cardTheme: CardThemeData(
      color: MonarchColors.glass,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: const BorderSide(color: MonarchColors.stroke),
      ),
      margin: EdgeInsets.zero,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: MonarchColors.surfaceStrong.withValues(alpha: 0.76),
      labelStyle: const TextStyle(color: MonarchColors.muted),
      hintStyle: const TextStyle(color: MonarchColors.muted),
      errorStyle: const TextStyle(color: MonarchColors.danger),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: const BorderSide(color: MonarchColors.stroke),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: const BorderSide(color: MonarchColors.stroke),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: const BorderSide(color: MonarchColors.gold, width: 1.35),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: const BorderSide(color: MonarchColors.danger),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: MonarchColors.gold,
        foregroundColor: MonarchColors.black,
        disabledBackgroundColor: MonarchColors.surfaceMuted,
        disabledForegroundColor: MonarchColors.muted,
        minimumSize: const Size(0, 52),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        elevation: 0,
        shadowColor: MonarchColors.gold.withValues(alpha: 0.35),
        textStyle: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w800,
          letterSpacing: 0,
        ),
        shape: roundedRectangle,
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: MonarchColors.text,
        minimumSize: const Size(0, 52),
        side: const BorderSide(color: MonarchColors.strokeStrong),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        textStyle: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w800,
          letterSpacing: 0,
        ),
        shape: roundedRectangle,
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: MonarchColors.goldSoft,
        textStyle: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w800,
          letterSpacing: 0,
        ),
      ),
    ),
    chipTheme: base.chipTheme.copyWith(
      backgroundColor: MonarchColors.glassStrong,
      selectedColor: MonarchColors.gold.withValues(alpha: 0.20),
      side: const BorderSide(color: MonarchColors.stroke),
      labelStyle: const TextStyle(
        color: MonarchColors.text,
        fontWeight: FontWeight.w700,
        letterSpacing: 0,
      ),
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: MonarchColors.surfaceStrong.withValues(alpha: 0.96),
      contentTextStyle: const TextStyle(color: MonarchColors.text),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return MonarchColors.goldSoft;
        }
        return MonarchColors.muted;
      }),
      trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return MonarchColors.gold.withValues(alpha: 0.34);
        }
        return MonarchColors.surfaceMuted;
      }),
    ),
    progressIndicatorTheme: const ProgressIndicatorThemeData(
      color: MonarchColors.gold,
      linearTrackColor: MonarchColors.surfaceMuted,
      circularTrackColor: MonarchColors.surfaceMuted,
    ),
  );
}
