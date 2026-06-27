import 'package:flutter/material.dart';

import '../data/demo_models.dart';
import '../theme/monarch_theme.dart';
import '../widgets/monarch_widgets.dart';

class InvestorShell extends StatefulWidget {
  const InvestorShell({
    super.key,
    required this.session,
    required this.onSignOut,
  });

  final MonarchSession session;
  final VoidCallback onSignOut;

  @override
  State<InvestorShell> createState() => _InvestorShellState();
}

class _InvestorShellState extends State<InvestorShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      _InvestorDashboard(session: widget.session),
      const _InvestorBoardroom(),
      const _InvestorMarkets(),
      const _InvestorIntelligence(),
      const _InvestorProfile(),
    ];

    return Scaffold(
      backgroundColor: MonarchColors.black,
      appBar: AppBar(
        toolbarHeight: 68,
        titleSpacing: 20,
        flexibleSpace: const MonarchFrostedBar(),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.session.organization,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            Text(
              widget.session.subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Reset demo',
            onPressed: widget.onSignOut,
            icon: const Icon(Icons.restart_alt_rounded),
          ),
        ],
      ),
      body: MonarchBackground(
        child: SafeArea(
          child: IndexedStack(index: _index, children: pages),
        ),
      ),
      bottomNavigationBar: MonarchBottomBar(
        child: NavigationBar(
          selectedIndex: _index,
          onDestinationSelected: (value) => setState(() => _index = value),
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.dashboard_outlined),
              selectedIcon: Icon(Icons.dashboard),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.domain_outlined),
              selectedIcon: Icon(Icons.domain),
              label: 'Boardroom',
            ),
            NavigationDestination(
              icon: Icon(Icons.candlestick_chart_outlined),
              selectedIcon: Icon(Icons.candlestick_chart),
              label: 'Markets',
            ),
            NavigationDestination(
              icon: Icon(Icons.feed_outlined),
              selectedIcon: Icon(Icons.feed),
              label: 'Intel',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}

class _InvestorDashboard extends StatelessWidget {
  const _InvestorDashboard({required this.session});

  final MonarchSession session;

  @override
  Widget build(BuildContext context) {
    final topPick = DemoRepository.marketSignals.first;
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      children: [
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Monarch Markets snapshot',
                subtitle: 'Immediate intelligence, not noise.',
                trailing: MonarchTag(
                  label: 'MIG ${topPick.migScore}',
                  tone: TagTone.gold,
                ),
              ),
              const SizedBox(height: 18),
              Text(
                topPick.company,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                topPick.rationale.first,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 18),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: DemoRepository.marketSignals
                    .map(
                      (signal) => MonarchTag(
                        label: '${signal.ticker}  MIG ${signal.migScore}',
                        tone: signal.migScore >= 85
                            ? TagTone.success
                            : TagTone.gold,
                      ),
                    )
                    .toList(growable: false),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        const MonarchStatGrid(
          children: [
            MonarchMiniStat(label: 'New vetted startups', value: '2'),
            MonarchMiniStat(label: 'Active interests', value: '4'),
            MonarchMiniStat(label: 'Boardroom sessions', value: '3'),
            MonarchMiniStat(label: 'Watchlist', value: '7'),
          ],
        ),
        const SizedBox(height: 16),
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Boardroom highlights',
                subtitle:
                    '${session.name}, this week\'s strongest private opportunities',
              ),
              const SizedBox(height: 16),
              Column(
                children: DemoRepository.boardroomStartups
                    .take(2)
                    .map((startup) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: _StartupTile(startup: startup),
                      );
                    })
                    .toList(growable: false),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _InvestorBoardroom extends StatelessWidget {
  const _InvestorBoardroom();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      children: [
        const MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Vetted startups',
                subtitle: 'Discovery stays curated, discreet, and high-signal',
              ),
              SizedBox(height: 16),
              MonarchBulletList(
                items: [
                  'Sector, stage, capital ask, and Monarch Index range lead every card.',
                  'Decks remain watermarked and view-only inside Monarch.',
                  'Direct contact details stay hidden until the deal room is unlocked.',
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        for (final startup in DemoRepository.boardroomStartups) ...[
          _StartupTile(startup: startup),
          const SizedBox(height: 12),
        ],
      ],
    );
  }
}

class _StartupTile extends StatelessWidget {
  const _StartupTile({required this.startup});

  final StartupSummary startup;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder: (_) => StartupDossierScreen(startup: startup),
          ),
        );
      },
      borderRadius: BorderRadius.circular(22),
      child: MonarchPanel(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                MonarchTag(label: startup.sector),
                MonarchTag(label: startup.stage),
                MonarchTag(label: startup.capitalAsk, tone: TagTone.gold),
              ],
            ),
            const SizedBox(height: 14),
            Text(startup.name, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            Text(startup.thesis, style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 14),
            Row(
              children: [
                MonarchTag(
                  label: 'Index ${startup.indexBand}',
                  tone: TagTone.gold,
                ),
                const Spacer(),
                const Icon(
                  Icons.arrow_forward_ios,
                  size: 18,
                  color: MonarchColors.goldSoft,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class StartupDossierScreen extends StatelessWidget {
  const StartupDossierScreen({super.key, required this.startup});

  final StartupSummary startup;

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        backgroundColor: MonarchColors.black,
        appBar: AppBar(
          toolbarHeight: 68,
          flexibleSpace: const MonarchFrostedBar(),
          title: Text(
            startup.name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(text: 'Overview'),
              Tab(text: 'Metrics'),
              Tab(text: 'Deck'),
              Tab(text: 'Risk'),
            ],
          ),
        ),
        body: MonarchBackground(
          child: TabBarView(
            children: [
              _StartupOverviewTab(startup: startup),
              _StartupMetricsTab(startup: startup),
              _StartupDeckTab(startup: startup),
              _StartupRiskTab(startup: startup),
            ],
          ),
        ),
        bottomNavigationBar: ColoredBox(
          color: MonarchColors.black,
          child: SafeArea(
            minimum: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            child: MonarchGlass(
              padding: const EdgeInsets.all(12),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {},
                      child: const Text('Mark interested'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        if (startup.mutualInterest) {
                          Navigator.of(context).push(
                            MaterialPageRoute<void>(
                              builder: (_) =>
                                  InvestorDealRoomScreen(startup: startup),
                            ),
                          );
                        }
                      },
                      child: Text(
                        startup.mutualInterest
                            ? 'Open deal room'
                            : 'Request intro',
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _StartupOverviewTab extends StatelessWidget {
  const _StartupOverviewTab({required this.startup});

  final StartupSummary startup;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Founder story',
                subtitle: 'Monarch-authored summary',
                trailing: MonarchTag(
                  label: startup.mutualInterest
                      ? 'Mutual interest'
                      : 'Reviewing',
                  tone: startup.mutualInterest
                      ? TagTone.success
                      : TagTone.warning,
                ),
              ),
              const SizedBox(height: 16),
              Text(startup.founderStory),
              const SizedBox(height: 18),
              MonarchBulletList(items: startup.overview),
            ],
          ),
        ),
      ],
    );
  }
}

class _StartupMetricsTab extends StatelessWidget {
  const _StartupMetricsTab({required this.startup});

  final StartupSummary startup;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const MonarchSectionHeader(
                title: 'Metrics',
                subtitle: 'Private investor view',
              ),
              const SizedBox(height: 16),
              MonarchMetricBars(metrics: startup.metrics),
            ],
          ),
        ),
      ],
    );
  }
}

class _StartupDeckTab extends StatelessWidget {
  const _StartupDeckTab({required this.startup});

  final StartupSummary startup;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: const [
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Deck access',
                subtitle: 'View-only and watermarked',
              ),
              SizedBox(height: 16),
              MonarchBulletList(
                items: [
                  'Watermarked PDF only, no raw download links exposed here.',
                  'Monarch tracks dossier views and deck opens.',
                  'Request deeper diligence inside the deal room after mutual interest.',
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _StartupRiskTab extends StatelessWidget {
  const _StartupRiskTab({required this.startup});

  final StartupSummary startup;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const MonarchSectionHeader(
                title: 'Monarch risk notes',
                subtitle: 'Human judgment layered on top of the index',
              ),
              const SizedBox(height: 16),
              MonarchBulletList(
                items: startup.riskNotes,
                emphasisColor: MonarchColors.warning,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class InvestorDealRoomScreen extends StatelessWidget {
  const InvestorDealRoomScreen({super.key, required this.startup});

  final StartupSummary startup;

  @override
  Widget build(BuildContext context) {
    return MonarchPage(
      eyebrow: 'DEAL ROOM',
      title: startup.name,
      subtitle: 'Encrypted chat, documents, and meetings unlocked',
      child: Column(
        children: const [
          MonarchPanel(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                MonarchSectionHeader(
                  title: 'Monarch-hosted controls',
                  subtitle: 'Protecting process and success fees',
                ),
                SizedBox(height: 16),
                MonarchBulletList(
                  items: [
                    'NDA confirmation is complete for this room.',
                    'Shared documents remain access-controlled.',
                    'Meeting scheduling stays within Monarch-hosted flows.',
                    'Every message and file exchange is time-stamped in the activity log.',
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _InvestorMarkets extends StatelessWidget {
  const _InvestorMarkets();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      children: [
        const MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Markets home',
                subtitle: 'MIG top picks, heatmap, and risk radar',
              ),
              SizedBox(height: 16),
              MonarchBulletList(
                items: [
                  'MIG top picks refresh with Monarch oversight.',
                  'Risk radar highlights where recommendation quality is fragile.',
                  'Custom portfolio reports remain one-time paid products.',
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        for (final signal in DemoRepository.marketSignals) ...[
          _MarketTile(signal: signal),
          const SizedBox(height: 12),
        ],
      ],
    );
  }
}

class _MarketTile extends StatelessWidget {
  const _MarketTile({required this.signal});

  final MarketSignal signal;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder: (_) => StockDetailScreen(signal: signal),
          ),
        );
      },
      borderRadius: BorderRadius.circular(22),
      child: MonarchPanel(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  signal.ticker,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(width: 10),
                MonarchTag(
                  label: signal.recommendation,
                  tone: signal.migScore >= 85 ? TagTone.success : TagTone.gold,
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(signal.company),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: Text(
                    'MIG ${signal.migScore} | Risk ${signal.riskIndex}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: MonarchColors.goldSoft,
                    ),
                  ),
                ),
                const Icon(
                  Icons.arrow_forward_ios,
                  size: 18,
                  color: MonarchColors.goldSoft,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class StockDetailScreen extends StatelessWidget {
  const StockDetailScreen({super.key, required this.signal});

  final MarketSignal signal;

  @override
  Widget build(BuildContext context) {
    return MonarchPage(
      eyebrow: 'MONARCH MARKETS',
      title: signal.ticker,
      subtitle: signal.company,
      child: Column(
        children: [
          MonarchPanel(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                MonarchSectionHeader(
                  title: signal.recommendation,
                  subtitle: 'Time horizon ${signal.timeHorizon}',
                  trailing: MonarchTag(
                    label: 'Risk ${signal.riskIndex}',
                    tone: signal.riskIndex <= 5
                        ? TagTone.success
                        : TagTone.warning,
                  ),
                ),
                const SizedBox(height: 18),
                Row(
                  children: [
                    MonarchScoreRing(score: signal.migScore, label: 'MIG'),
                    const SizedBox(width: 16),
                    Expanded(child: MonarchBulletList(items: signal.rationale)),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'Suggested allocation ${signal.allocation}',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: MonarchColors.goldSoft,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {},
                  child: const Text('Add to watchlist'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {},
                  child: const Text('Request report'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _InvestorIntelligence extends StatelessWidget {
  const _InvestorIntelligence();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      children: [
        const MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Intelligence feed',
                subtitle: 'Monarch-authored insights only',
              ),
              SizedBox(height: 16),
              MonarchBulletList(
                items: [
                  'Weekly market insights anchored in Monarch research.',
                  'Boardroom summaries for active deal evaluation.',
                  'Sector deep dives and private notes with access control.',
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const MonarchSectionHeader(
                title: 'Reports library',
                subtitle: 'Downloadable and time-stamped',
              ),
              const SizedBox(height: 16),
              for (final report in DemoRepository.reports)
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.picture_as_pdf_outlined,
                        color: MonarchColors.gold,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(report.title),
                            Text(
                              '${report.type} | ${report.timestamp}',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _InvestorProfile extends StatelessWidget {
  const _InvestorProfile();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      children: [
        const MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Access and profile',
                subtitle: 'Reinforce exclusivity and control',
              ),
              SizedBox(height: 16),
              _ProfileLine(label: 'Access tier', value: 'Boardroom member'),
              _ProfileLine(label: 'NDA', value: 'Signed'),
              _ProfileLine(
                label: 'Token status',
                value: 'One-time access active',
              ),
              _ProfileLine(label: 'Activity history', value: 'Monitored'),
            ],
          ),
        ),
        const SizedBox(height: 16),
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const MonarchSectionHeader(
                title: 'Security log',
                subtitle: 'Session control and device review',
              ),
              const SizedBox(height: 16),
              for (final event in DemoRepository.securityEvents)
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(
                        Icons.verified_user_outlined,
                        color: MonarchColors.gold,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(event.title),
                            Text(
                              event.detail,
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                      Text(
                        event.time,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ProfileLine extends StatelessWidget {
  const _ProfileLine({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: Theme.of(
              context,
            ).textTheme.bodySmall?.copyWith(color: MonarchColors.goldSoft),
          ),
        ],
      ),
    );
  }
}
