package com.example.atr3.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.ui.graphics.Color
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = PrimaryBlue,
    onPrimary = TextInverse,
    primaryContainer = PrimaryBlueLight,
    onPrimaryContainer = TextInverse,
    secondary = SecondaryGreen,
    onSecondary = TextInverse,
    secondaryContainer = SecondaryGreenLight,
    onSecondaryContainer = TextInverse,
    tertiary = AccentPurple,
    onTertiary = TextInverse,
    tertiaryContainer = Color(0xFFE0E7FF),
    onTertiaryContainer = AccentPurple,
    error = ErrorRed,
    onError = TextInverse,
    errorContainer = Color(0xFFFEE2E2),
    onErrorContainer = ErrorRed,
    background = BackgroundPrimary,
    onBackground = TextPrimary,
    surface = BackgroundCard,
    onSurface = TextPrimary,
    surfaceVariant = Neutral100,
    onSurfaceVariant = TextSecondary,
    outline = BorderLight,
    outlineVariant = BorderMedium,
    scrim = BackgroundOverlay,
    surfaceTint = PrimaryBlue,
    inverseSurface = Neutral900,
    inverseOnSurface = TextInverse,
    inversePrimary = PrimaryBlueLight,
)

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryBlueLight,
    onPrimary = TextInverse,
    primaryContainer = PrimaryBlue,
    onPrimaryContainer = TextInverse,
    secondary = SecondaryGreenLight,
    onSecondary = TextInverse,
    secondaryContainer = SecondaryGreen,
    onSecondaryContainer = TextInverse,
    tertiary = AccentPurple,
    onTertiary = TextInverse,
    tertiaryContainer = Color(0xFF4C1D95),
    onTertiaryContainer = Color(0xFFE0E7FF),
    error = ErrorRed,
    onError = TextInverse,
    errorContainer = Color(0xFF7F1D1D),
    onErrorContainer = Color(0xFFFEE2E2),
    background = Neutral900,
    onBackground = TextInverse,
    surface = Neutral800,
    onSurface = TextInverse,
    surfaceVariant = Neutral700,
    onSurfaceVariant = Neutral300,
    outline = Neutral600,
    outlineVariant = Neutral700,
    scrim = BackgroundOverlay,
    surfaceTint = PrimaryBlueLight,
    inverseSurface = Neutral100,
    inverseOnSurface = TextPrimary,
    inversePrimary = PrimaryBlue,
)

@Composable
fun ATR3Theme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}