import 'package:flutter/material.dart';

import '../data/demo_models.dart';
import '../theme/monarch_theme.dart';
import '../widgets/monarch_widgets.dart';

class AdminShell extends StatelessWidget {
  const AdminShell({super.key, required this.session, required this.onSignOut});

  final MonarchSession session;
  final VoidCallback onSignOut;

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 5,
      child: Scaffold(
        backgroundColor: MonarchColors.black,
        appBar: AppBar(
          toolbarHeight: 68,
          titleSpacing: 20,
          flexibleSpace: const MonarchFrostedBar(),
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(session.name, maxLines: 1, overflow: TextOverflow.ellipsis),
              Text(
                session.organization,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
          actions: [
            IconButton(
              tooltip: 'Reset demo',
              onPressed: onSignOut,
              icon: const Icon(Icons.restart_alt_rounded),
            ),
          ],
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(text: 'Vetting'),
              Tab(text: 'Deals'),
              Tab(text: 'Markets'),
              Tab(text: 'Governance'),
              Tab(text: 'Revenue'),
            ],
          ),
        ),
        body: const MonarchBackground(
          child: SafeArea(
            child: TabBarView(
              children: [
                _AdminVettingView(),
                _AdminDealsView(),
                _AdminMarketsView(),
                _AdminGovernanceView(),
                _AdminRevenueView(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _AdminVettingView extends StatelessWidget {
  const _AdminVettingView();

  @override
  Widget build(BuildContext context) {
    final item = DemoRepository.adminQueue.first;
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      children: [
        const MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MonarchSectionHeader(
                title: 'Application and vetting console',
                subtitle: 'Trust starts with selective entry',
              ),
              SizedBox(height: 16),
              MonarchBulletList(
                items: [
                  'Identity, legitimacy, and business fundamentals are reviewed in sequence.',
                  'Monarch Index thresholds act as gates, not public leaderboards.',
                  'Council review can approve, defer, or reject with conditions.',
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
                title: 'Review queue',
                subtitle: 'Founder and investor applications',
              ),
              const SizedBox(height: 16),
              for (final queueItem in DemoRepository.adminQueue)
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(queueItem.name),
                            Text(
                              queueItem.role.label,
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                      MonarchTag(
                        label: queueItem.status,
                        tone: TagTone.warning,
                      ),
                    ],
                  ),
                ),
              const Divider(),
              const SizedBox(height: 8),
              Text(
                'Selected review: ${item.name}',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 14),
              MonarchMetricBars(metrics: item.scoring),
              const SizedBox(height: 8),
              MonarchBulletList(
                items: item.flags,
                emphasisColor: MonarchColors.warning,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {},
                      child: const Text('Approve'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {},
                      child: const Text('Clarify'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {},
                      child: const Text('Reject'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _AdminDealsView extends StatelessWidget {
  const _AdminDealsView();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      children: [
        const MonarchStatGrid(
          children: [
            MonarchMiniStat(label: 'Active deals', value: '12'),
            MonarchMiniStat(label: 'Introductions', value: '34'),
            MonarchMiniStat(label: 'Fee alerts', value: '5'),
            MonarchMiniStat(label: 'Open boardrooms', value: '7'),
          ],
        ),
        const SizedBox(height: 16),
        MonarchPanel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const MonarchSectionHeader(
                title: 'Deal flow management',
                subtitle: 'Protect introductions, stages, and revenue',
              ),
              const SizedBox(height: 16),
              for (final tracker in DemoRepository.dealTrackers)
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
                                '${tracker.founder} x ${tracker.investor}',
                                style: Theme.of(context).textTheme.titleMedium,
                              ),
                            ),
                            MonarchTag(
                              label: tracker.feeState,
                              tone: tracker.feeState == 'Triggered'
                                  ? TagTone.success
                                  : TagTone.gold,
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${tracker.stage} | ${tracker.lastUpdate}',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _AdminMarketsView extends StatelessWidget {
  const _AdminMarketsView();

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
                title: 'MIG engine controls',
                subtitle: 'Approval, overrides, and publishing',
              ),
              SizedBox(height: 16),
              MonarchBulletList(
                items: [
                  'Signals do not publish automatically.',
                  'Risk overrides are logged to protect Monarch reputation.',
                  'Performance tracking ensures the engine stays auditable.',
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        for (final signal in DemoRepository.marketSignals)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: MonarchPanel(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${signal.ticker} | ${signal.company}',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'MIG ${signal.migScore} | Risk ${signal.riskIndex}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {},
                          child: const Text('Approve'),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {},
                          child: const Text('Override'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class _AdminGovernanceView extends StatelessWidget {
  const _AdminGovernanceView();

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
                title: 'Governance and security',
                subtitle: 'Elite platforms survive on enforcement',
              ),
              SizedBox(height: 16),
              MonarchBulletList(
                items: [
                  'Suspension, blacklist, and whitelist controls stay in Monarch Core.',
                  'Anti-circumvention flags route directly to enforcement review.',
                  'Legal notices and activity audits are retained for governance discipline.',
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        for (final flag in DemoRepository.governanceFlags)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: MonarchPanel(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          flag.member,
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                      ),
                      MonarchTag(
                        label: flag.severity,
                        tone: flag.severity == 'High'
                            ? TagTone.danger
                            : TagTone.warning,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(flag.issue),
                  const SizedBox(height: 10),
                  Text(
                    'Action: ${flag.action}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: MonarchColors.goldSoft,
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class _AdminRevenueView extends StatelessWidget {
  const _AdminRevenueView();

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
                title: 'Revenue by stream',
                subtitle: 'Founder-level visibility for scaling decisions',
              ),
              const SizedBox(height: 16),
              for (final metric in DemoRepository.revenueMetrics)
                Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(child: Text(metric.label)),
                          Text(
                            metric.value,
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(color: MonarchColors.goldSoft),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(999),
                        child: LinearProgressIndicator(
                          value: metric.progress,
                          minHeight: 8,
                          backgroundColor: MonarchColors.surfaceMuted,
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            MonarchColors.gold,
                          ),
                        ),
                      ),
                    ],
                  ),
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
                title: 'Founder funnel',
                subtitle: 'Conversion and throughput',
              ),
              const SizedBox(height: 16),
              for (final step in DemoRepository.funnelMetrics)
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      Expanded(child: Text(step.label)),
                      Text(
                        '${step.count}',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          step.note,
                          textAlign: TextAlign.end,
                          style: Theme.of(context).textTheme.bodySmall,
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
