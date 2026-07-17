import 'package:flutter/material.dart';

import '../data/demo_models.dart';
import '../theme/monarch_theme.dart';
import '../widgets/monarch_widgets.dart';

class FounderShell extends StatefulWidget {
  const FounderShell({
    super.key,
    required this.session,
    required this.onSignOut,
  });

  final MonarchSession session;
  final VoidCallback onSignOut;

  @override
  State<FounderShell> createState() => _FounderShellState();
}

class _FounderShellState extends State<FounderShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      _FounderDashboard(session: widget.session),
      const _FounderDossier(),
      const _FounderBoardroom(),
      const _FounderDealRoom(),
      const _FounderPayments(),
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
              icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.description_outlined),
              selectedIcon: Icon(Icons.description),
              label: 'Dossier',
            ),
            NavigationDestination(
              icon: Icon(Icons.campaign_outlined),
              selectedIcon: Icon(Icons.campaign),
              label: 'Boardroom',
            ),
            NavigationDestination(
              icon: Icon(Icons.lock_outline),
              selectedIcon: Icon(Icons.lock),
              label: 'Deal',
            ),
            NavigationDestination(
              icon: Icon(Icons.receipt_long_outlined),
              selectedIcon: Icon(Icons.receipt_long),
              label: 'Payments',
            ),
          ],
        ),
      ),
    );
  }
}

class _FounderDashboard extends StatelessWidget {
  const _FounderDashboard({required this.session});

  final MonarchSession session;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      children: [
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const MonarchSectionHeader(
                title: 'Private readiness status',
                subtitle:
                    'Monarch Certified is not permanent, public, or pay-to-play.',
                trailing: MonarchTag(label: 'Under review', tone: TagTone.gold),
              ),
              const SizedBox(height: 18),
              const MonarchTimeline(
                steps: DemoRepository.founderApplicationTimeline,
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        const _FounderScoreOverview(),
        const SizedBox(height: 16),
        const MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Certification flow',
                subtitle: 'Multi-layer diligence, scoring, and curation',
              ),
              SizedBox(height: 16),
              MonarchTimeline(steps: DemoRepository.founderCertificationFlow),
            ],
          ),
        ),
        const SizedBox(height: 16),
        const MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Next required actions',
                subtitle: 'Monarch controls the pace and sequence',
              ),
              SizedBox(height: 16),
              _ActionList(items: DemoRepository.founderActions),
            ],
          ),
        ),
        const SizedBox(height: 16),
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Messages',
                subtitle: 'Monarch only. Investor DMs stay locked.',
                trailing: MonarchTag(
                  label: session.name,
                  tone: TagTone.neutral,
                ),
              ),
              const SizedBox(height: 16),
              const _MessageList(items: DemoRepository.founderMessages),
            ],
          ),
        ),
      ],
    );
  }
}

class _FounderScoreOverview extends StatelessWidget {
  const _FounderScoreOverview();

  @override
  Widget build(BuildContext context) {
    const scorePanel = MonarchPanel(
      accent: true,
      child: Column(
        children: [
          MonarchScoreRing(score: 72, label: 'Monarch Index'),
          SizedBox(height: 12),
          Text(
            'Private, non-comparable, and used only inside Monarch.',
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
    const metricPanel = MonarchPanel(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          MonarchSectionHeader(
            title: 'Score drivers',
            subtitle: 'Strengths, gaps, and risk bands',
          ),
          SizedBox(height: 16),
          MonarchMetricBars(metrics: DemoRepository.founderScorecard),
        ],
      ),
    );

    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 560) {
          return const Column(
            children: [scorePanel, SizedBox(height: 12), metricPanel],
          );
        }
        return const Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: scorePanel),
            SizedBox(width: 12),
            Expanded(child: metricPanel),
          ],
        );
      },
    );
  }
}

class _FounderDossier extends StatelessWidget {
  const _FounderDossier();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      children: const [
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Company overview',
                subtitle: 'Structured investment profile',
              ),
              SizedBox(height: 16),
              MonarchBulletList(items: DemoRepository.dossierHighlights),
            ],
          ),
        ),
        SizedBox(height: 16),
        MonarchStatGrid(
          children: [
            MonarchMiniStat(label: 'Revenue run-rate', value: '\$1.7M'),
            MonarchMiniStat(label: 'Growth', value: '24% QoQ'),
            MonarchMiniStat(label: 'Active pilots', value: '5'),
            MonarchMiniStat(label: 'Runway', value: '14 months'),
          ],
        ),
        SizedBox(height: 16),
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Cap table snapshot',
                subtitle: 'Self-attested with Monarch spot checks',
              ),
              SizedBox(height: 14),
              _InfoLine(label: 'Founders', value: '68%'),
              _InfoLine(label: 'Employees', value: '10%'),
              _InfoLine(label: 'Early investors', value: '22%'),
              SizedBox(height: 18),
              MonarchSectionHeader(
                title: 'Risk disclosures',
                subtitle: 'Founder-filled and privately reviewed',
              ),
              SizedBox(height: 14),
              MonarchBulletList(items: DemoRepository.dossierRiskNotes),
            ],
          ),
        ),
        SizedBox(height: 16),
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Deck versioning',
                subtitle: 'View-only copies remain under Monarch control',
              ),
              SizedBox(height: 14),
              _InfoLine(label: 'Active deck', value: 'Version 4'),
              _InfoLine(label: 'Updated', value: 'Apr 21, 2026'),
              _InfoLine(label: 'Visibility', value: 'Private by default'),
            ],
          ),
        ),
      ],
    );
  }
}

class _FounderBoardroom extends StatelessWidget {
  const _FounderBoardroom();

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
                title: 'Boardroom progress',
                subtitle: 'Anonymous interest and intro requests only',
              ),
              SizedBox(height: 16),
              _DealUpdateList(items: DemoRepository.founderInterests),
            ],
          ),
        ),
        const SizedBox(height: 16),
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const MonarchSectionHeader(
                title: 'Why this matters',
                subtitle: 'Monarch protects process integrity and economics',
              ),
              const SizedBox(height: 14),
              const MonarchBulletList(
                items: [
                  'Investors appear anonymously until Monarch is ready to unlock the conversation.',
                  'Every introduction is logged so success-fee economics remain enforceable.',
                  'Boardroom sessions are curated, not opened to public browsing.',
                ],
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => showMonarchNotice(
                  context,
                  'Boardroom preparation checklist opened for review.',
                ),
                child: const Text('Review prep checklist'),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _FounderDealRoom extends StatelessWidget {
  const _FounderDealRoom();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      children: const [
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Deal room controls',
                subtitle: 'Secure once interest is mutual',
              ),
              SizedBox(height: 16),
              _DealUpdateList(items: DemoRepository.founderDealRoom),
            ],
          ),
        ),
        SizedBox(height: 16),
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Monarch protections',
                subtitle: 'No external contact details until authorized',
              ),
              SizedBox(height: 14),
              MonarchBulletList(
                items: [
                  'Encrypted chat keeps the conversation on-platform.',
                  'Document exchange is logged and time-stamped.',
                  'Meeting scheduling stays Monarch-hosted to prevent leakage.',
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _FounderPayments extends StatelessWidget {
  const _FounderPayments();

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
                title: 'Payments and agreements',
                subtitle: 'Quiet, contextual monetization',
              ),
              SizedBox(height: 16),
              _PaymentList(items: DemoRepository.founderPayments),
            ],
          ),
        ),
        const SizedBox(height: 16),
        const MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Badge rules',
                subtitle: 'Allowed only in approved contexts',
              ),
              SizedBox(height: 14),
              MonarchBulletList(
                items: [
                  'Use the badge in private investor conversations and pitch deck footers.',
                  'Do not imply Monarch guarantees funding or public endorsement.',
                  'Certification can be paused or revoked if misconduct or misrepresentation appears.',
                ],
              ),
              SizedBox(height: 16),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  MonarchTag(label: 'Non-transferable', tone: TagTone.warning),
                  MonarchTag(label: '6 to 12 months', tone: TagTone.gold),
                  MonarchTag(label: 'Revocable', tone: TagTone.danger),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ActionList extends StatelessWidget {
  const _ActionList({required this.items});

  final List<ActionItem> items;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final item in items)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Container(
              decoration: BoxDecoration(
                color: MonarchColors.surfaceStrong,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: MonarchColors.stroke),
              ),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                title: Text(item.title),
                subtitle: Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(item.detail),
                ),
                trailing: Icon(
                  item.complete ? Icons.check_circle : Icons.arrow_forward_ios,
                  color: item.complete
                      ? MonarchColors.success
                      : MonarchColors.goldSoft,
                  size: item.complete ? 22 : 18,
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _MessageList extends StatelessWidget {
  const _MessageList({required this.items});

  final List<MessageItem> items;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final item in items)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: MonarchColors.gold.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignment: Alignment.center,
                  child: const Text(
                    'M',
                    style: TextStyle(
                      color: MonarchColors.goldSoft,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.sender),
                      const SizedBox(height: 4),
                      Text(
                        item.preview,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Text(item.time, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
      ],
    );
  }
}

class _DealUpdateList extends StatelessWidget {
  const _DealUpdateList({required this.items});

  final List<DealUpdate> items;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final item in items)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Container(
              decoration: BoxDecoration(
                color: item.highlight
                    ? MonarchColors.gold.withValues(alpha: 0.08)
                    : MonarchColors.surfaceStrong,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(
                  color: item.highlight
                      ? MonarchColors.gold.withValues(alpha: 0.35)
                      : MonarchColors.stroke,
                ),
              ),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          item.title,
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                      ),
                      Text(
                        item.time,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item.detail,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class _PaymentList extends StatelessWidget {
  const _PaymentList({required this.items});

  final List<PaymentRecord> items;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final item in items)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Container(
              decoration: BoxDecoration(
                color: MonarchColors.surfaceStrong,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: MonarchColors.stroke),
              ),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          item.title,
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                      ),
                      MonarchTag(
                        label: item.status,
                        tone: item.status == 'Paid' || item.status == 'Signed'
                            ? TagTone.success
                            : TagTone.warning,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item.amount,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: MonarchColors.goldSoft,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item.detail,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class _InfoLine extends StatelessWidget {
  const _InfoLine({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Expanded(
            child: Text(label, style: Theme.of(context).textTheme.bodyMedium),
          ),
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
