import 'dart:ui';

import 'package:flutter/material.dart';

import '../data/demo_models.dart';
import '../theme/monarch_theme.dart';

class MonarchAssets {
  static const String baseLogo = 'assets/brand/base_logo.png';
}

class MonarchBackground extends StatelessWidget {
  const MonarchBackground({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            MonarchColors.black,
            MonarchColors.ink,
            Color(0xFF07110F),
            MonarchColors.black,
          ],
          stops: [0, 0.36, 0.72, 1],
        ),
      ),
      child: Stack(
        children: [
          const Positioned.fill(child: _MonarchBackdropTexture()),
          Positioned.fill(child: child),
        ],
      ),
    );
  }
}

class _MonarchBackdropTexture extends StatelessWidget {
  const _MonarchBackdropTexture();

  @override
  Widget build(BuildContext context) {
    return CustomPaint(painter: _MonarchBackdropPainter());
  }
}

class _MonarchBackdropPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final sweepPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0x22F0D59B), Color(0x008FB4FF), Color(0x168DE0BE)],
      ).createShader(Offset.zero & size);
    canvas.drawRect(Offset.zero & size, sweepPaint);

    final linePaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.025)
      ..strokeWidth = 1;
    for (var offset = -size.height; offset < size.width; offset += 34) {
      canvas.drawLine(
        Offset(offset, 0),
        Offset(offset + size.height, size.height),
        linePaint,
      );
    }

    final highlight = Paint()
      ..shader = RadialGradient(
        center: const Alignment(-0.9, -1.0),
        radius: 1.5,
        colors: [
          MonarchColors.goldSoft.withValues(alpha: 0.14),
          Colors.transparent,
        ],
      ).createShader(Offset.zero & size);
    canvas.drawRect(Offset.zero & size, highlight);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class MonarchFrostedBar extends StatelessWidget {
  const MonarchFrostedBar({super.key});

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: MonarchColors.black.withValues(alpha: 0.58),
            border: Border(
              bottom: BorderSide(
                color: MonarchColors.stroke.withValues(alpha: 0.7),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class MonarchBottomBar extends StatelessWidget {
  const MonarchBottomBar({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: MonarchColors.black,
      child: SafeArea(
        top: false,
        minimum: const EdgeInsets.fromLTRB(12, 0, 12, 12),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.white.withValues(alpha: 0.11),
                    Colors.white.withValues(alpha: 0.045),
                    MonarchColors.gold.withValues(alpha: 0.06),
                  ],
                ),
                border: Border.all(color: MonarchColors.stroke),
              ),
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}

class MonarchLogoMark extends StatelessWidget {
  const MonarchLogoMark({
    super.key,
    this.size = 72,
    this.radius,
    this.framed = true,
    this.fit = BoxFit.cover,
  });

  final double size;
  final BorderRadius? radius;
  final bool framed;
  final BoxFit fit;

  @override
  Widget build(BuildContext context) {
    final borderRadius = radius ?? BorderRadius.circular(size * 0.28);
    final logo = ClipRRect(
      borderRadius: borderRadius,
      child: Image.asset(
        MonarchAssets.baseLogo,
        width: size,
        height: size,
        fit: fit,
        filterQuality: FilterQuality.high,
      ),
    );

    if (!framed) {
      return logo;
    }

    return Semantics(
      label: 'Monarch logo',
      image: true,
      child: Container(
        width: size,
        height: size,
        padding: const EdgeInsets.all(2),
        decoration: BoxDecoration(
          borderRadius: borderRadius,
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              MonarchColors.goldSoft.withValues(alpha: 0.9),
              Colors.white.withValues(alpha: 0.25),
              MonarchColors.blue.withValues(alpha: 0.25),
            ],
          ),
          boxShadow: [
            BoxShadow(
              color: MonarchColors.gold.withValues(alpha: 0.28),
              blurRadius: 24,
              offset: const Offset(0, 12),
            ),
          ],
        ),
        child: logo,
      ),
    );
  }
}

class MonarchGlass extends StatelessWidget {
  const MonarchGlass({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.radius = 22,
    this.accent = false,
  });

  final Widget child;
  final EdgeInsets padding;
  final double radius;
  final bool accent;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.white.withValues(alpha: accent ? 0.14 : 0.095),
                Colors.white.withValues(alpha: 0.045),
                MonarchColors.gold.withValues(alpha: accent ? 0.10 : 0.035),
              ],
            ),
            borderRadius: BorderRadius.circular(radius),
            border: Border.all(
              color: accent ? MonarchColors.strokeStrong : MonarchColors.stroke,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.25),
                blurRadius: 24,
                offset: const Offset(0, 16),
              ),
            ],
          ),
          child: Padding(padding: padding, child: child),
        ),
      ),
    );
  }
}

class MonarchPage extends StatelessWidget {
  const MonarchPage({
    super.key,
    required this.title,
    required this.subtitle,
    required this.child,
    this.eyebrow,
    this.actions,
    this.padding = const EdgeInsets.fromLTRB(20, 16, 20, 24),
  });

  final String title;
  final String subtitle;
  final String? eyebrow;
  final Widget child;
  final List<Widget>? actions;
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: MonarchColors.black,
      appBar: AppBar(
        toolbarHeight: eyebrow == null ? 68 : 78,
        titleSpacing: 20,
        flexibleSpace: const MonarchFrostedBar(),
        title: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (eyebrow != null)
              Text(
                eyebrow!,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: MonarchColors.goldSoft,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0,
                ),
              ),
            Text(title, maxLines: 1, overflow: TextOverflow.ellipsis),
            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: theme.textTheme.bodySmall,
            ),
          ],
        ),
        actions: actions,
      ),
      body: MonarchBackground(
        child: SafeArea(
          child: SingleChildScrollView(padding: padding, child: child),
        ),
      ),
    );
  }
}

class MonarchPanel extends StatelessWidget {
  const MonarchPanel({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.accent = false,
  });

  final Widget child;
  final EdgeInsets padding;
  final bool accent;

  @override
  Widget build(BuildContext context) {
    return MonarchGlass(padding: padding, accent: accent, child: child);
  }
}

class MonarchSectionHeader extends StatelessWidget {
  const MonarchSectionHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.trailing,
  });

  final String title;
  final String? subtitle;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: Theme.of(context).textTheme.titleLarge),
              if (subtitle != null) ...[
                const SizedBox(height: 5),
                Text(subtitle!, style: Theme.of(context).textTheme.bodySmall),
              ],
            ],
          ),
        ),
        if (trailing != null) ...[
          const SizedBox(width: 12),
          Flexible(flex: 0, child: trailing!),
        ],
      ],
    );
  }
}

class MonarchTag extends StatelessWidget {
  const MonarchTag({
    super.key,
    required this.label,
    this.tone = TagTone.neutral,
  });

  final String label;
  final TagTone tone;

  @override
  Widget build(BuildContext context) {
    late final Color background;
    late final Color foreground;
    late final Color border;
    switch (tone) {
      case TagTone.gold:
        background = MonarchColors.gold.withValues(alpha: 0.16);
        foreground = MonarchColors.goldSoft;
        border = MonarchColors.gold.withValues(alpha: 0.36);
      case TagTone.success:
        background = MonarchColors.success.withValues(alpha: 0.14);
        foreground = MonarchColors.success;
        border = MonarchColors.success.withValues(alpha: 0.28);
      case TagTone.warning:
        background = MonarchColors.warning.withValues(alpha: 0.14);
        foreground = MonarchColors.warning;
        border = MonarchColors.warning.withValues(alpha: 0.28);
      case TagTone.danger:
        background = MonarchColors.danger.withValues(alpha: 0.14);
        foreground = MonarchColors.danger;
        border = MonarchColors.danger.withValues(alpha: 0.26);
      case TagTone.neutral:
        background = Colors.white.withValues(alpha: 0.08);
        foreground = MonarchColors.text;
        border = MonarchColors.stroke;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: border),
      ),
      child: Text(
        label,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: foreground,
          fontWeight: FontWeight.w800,
          letterSpacing: 0,
        ),
      ),
    );
  }
}

enum TagTone { neutral, gold, success, warning, danger }

class MonarchTimeline extends StatelessWidget {
  const MonarchTimeline({super.key, required this.steps});

  final List<TimelineStepData> steps;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (var index = 0; index < steps.length; index++)
          _TimelineRow(
            step: steps[index],
            showConnector: index != steps.length - 1,
          ),
      ],
    );
  }
}

class _TimelineRow extends StatelessWidget {
  const _TimelineRow({required this.step, required this.showConnector});

  final TimelineStepData step;
  final bool showConnector;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = step.complete || step.current
        ? MonarchColors.gold
        : MonarchColors.stroke;
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 260),
                width: 18,
                height: 18,
                decoration: BoxDecoration(
                  color: step.complete
                      ? MonarchColors.gold
                      : step.current
                      ? MonarchColors.gold.withValues(alpha: 0.18)
                      : Colors.transparent,
                  border: Border.all(color: color, width: 1.5),
                  shape: BoxShape.circle,
                ),
                child: step.complete
                    ? const Icon(
                        Icons.check,
                        size: 12,
                        color: MonarchColors.black,
                      )
                    : null,
              ),
              if (showConnector)
                Expanded(
                  child: Container(
                    width: 1.5,
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    color: MonarchColors.stroke,
                  ),
                ),
            ],
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    step.label,
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: step.current ? MonarchColors.goldSoft : null,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(step.detail, style: theme.textTheme.bodySmall),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class MonarchScoreRing extends StatelessWidget {
  const MonarchScoreRing({
    super.key,
    required this.score,
    required this.label,
    this.size = 132,
  });

  final int score;
  final String label;
  final double size;

  @override
  Widget build(BuildContext context) {
    final progress = score.clamp(0, 100).toDouble() / 100;
    return SizedBox(
      width: size,
      height: size,
      child: TweenAnimationBuilder<double>(
        duration: const Duration(milliseconds: 700),
        curve: Curves.easeOutCubic,
        tween: Tween(begin: 0, end: progress),
        builder: (context, value, _) {
          return Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: size,
                height: size,
                child: CircularProgressIndicator(
                  value: value,
                  strokeWidth: 10,
                  strokeCap: StrokeCap.round,
                  backgroundColor: MonarchColors.surfaceMuted,
                  valueColor: const AlwaysStoppedAnimation<Color>(
                    MonarchColors.gold,
                  ),
                ),
              ),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '$score',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(label, style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
            ],
          );
        },
      ),
    );
  }
}

class MonarchMetricBars extends StatelessWidget {
  const MonarchMetricBars({super.key, required this.metrics});

  final List<ScoreMetric> metrics;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final metric in metrics) ...[
          Row(
            children: [
              Expanded(
                child: Text(
                  metric.label,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
              Text(
                '${metric.value}',
                style: Theme.of(
                  context,
                ).textTheme.bodySmall?.copyWith(color: MonarchColors.goldSoft),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: TweenAnimationBuilder<double>(
              duration: const Duration(milliseconds: 650),
              curve: Curves.easeOutCubic,
              tween: Tween(
                begin: 0,
                end: metric.value.clamp(0, 100).toDouble() / 100,
              ),
              builder: (context, value, _) {
                return LinearProgressIndicator(
                  value: value,
                  minHeight: 8,
                  backgroundColor: MonarchColors.surfaceMuted,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    metric.label == 'Risk flags'
                        ? MonarchColors.warning
                        : MonarchColors.gold,
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 14),
        ],
      ],
    );
  }
}

class MonarchBulletList extends StatelessWidget {
  const MonarchBulletList({super.key, required this.items, this.emphasisColor});

  final List<String> items;
  final Color? emphasisColor;

  @override
  Widget build(BuildContext context) {
    final bulletColor = emphasisColor ?? MonarchColors.gold;
    return Column(
      children: [
        for (final item in items)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 7),
                  child: Container(
                    width: 7,
                    height: 7,
                    decoration: BoxDecoration(
                      color: bulletColor,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: bulletColor.withValues(alpha: 0.36),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    item,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

class MonarchStatGrid extends StatelessWidget {
  const MonarchStatGrid({super.key, required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final maxWidth = constraints.maxWidth.isFinite
            ? constraints.maxWidth
            : 360.0;
        final columns = maxWidth >= 720
            ? 4
            : maxWidth >= 360
            ? 2
            : 1;
        const spacing = 12.0;
        final itemWidth = (maxWidth - (spacing * (columns - 1))) / columns;
        return Wrap(
          spacing: spacing,
          runSpacing: spacing,
          children: children
              .map((child) => SizedBox(width: itemWidth, child: child))
              .toList(growable: false),
        );
      },
    );
  }
}

class MonarchMiniStat extends StatelessWidget {
  const MonarchMiniStat({
    super.key,
    required this.label,
    required this.value,
    this.accent,
  });

  final String label;
  final String value;
  final Color? accent;

  @override
  Widget build(BuildContext context) {
    return MonarchPanel(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: 10),
          Text(
            value,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              color: accent ?? MonarchColors.text,
            ),
          ),
        ],
      ),
    );
  }
}
