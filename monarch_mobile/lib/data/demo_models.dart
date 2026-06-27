import 'package:flutter/material.dart';

enum AppRole { founder, investor, admin }

extension AppRoleX on AppRole {
  String get label {
    switch (this) {
      case AppRole.founder:
        return 'Founder';
      case AppRole.investor:
        return 'Investor / Executive';
      case AppRole.admin:
        return 'Monarch Core';
    }
  }

  String get description {
    switch (this) {
      case AppRole.founder:
        return 'Vet, prepare, and advance through Monarch review.';
      case AppRole.investor:
        return 'Discover, evaluate, allocate, and track with discretion.';
      case AppRole.admin:
        return 'Control trust, governance, monetization, and outcomes.';
    }
  }

  String get inviteCode {
    switch (this) {
      case AppRole.founder:
        return 'MONARCH-2026';
      case AppRole.investor:
        return 'INVESTOR-2026';
      case AppRole.admin:
        return 'ADMIN-GLOBAL';
    }
  }

  IconData get icon {
    switch (this) {
      case AppRole.founder:
        return Icons.workspace_premium_outlined;
      case AppRole.investor:
        return Icons.trending_up_outlined;
      case AppRole.admin:
        return Icons.verified_user_outlined;
    }
  }
}

class MonarchSession {
  const MonarchSession({
    required this.role,
    required this.name,
    required this.organization,
  });

  final AppRole role;
  final String name;
  final String organization;

  String get subtitle {
    switch (role) {
      case AppRole.founder:
        return 'Founder dashboard';
      case AppRole.investor:
        return 'Investor intelligence';
      case AppRole.admin:
        return 'Governance console';
    }
  }
}

class TimelineStepData {
  const TimelineStepData({
    required this.label,
    required this.detail,
    this.complete = false,
    this.current = false,
  });

  final String label;
  final String detail;
  final bool complete;
  final bool current;
}

class ScoreMetric {
  const ScoreMetric(this.label, this.value);

  final String label;
  final int value;
}

class ActionItem {
  const ActionItem({
    required this.title,
    required this.detail,
    this.complete = false,
  });

  final String title;
  final String detail;
  final bool complete;
}

class MessageItem {
  const MessageItem({
    required this.sender,
    required this.preview,
    required this.time,
  });

  final String sender;
  final String preview;
  final String time;
}

class StartupSummary {
  const StartupSummary({
    required this.id,
    required this.name,
    required this.sector,
    required this.stage,
    required this.capitalAsk,
    required this.indexBand,
    required this.thesis,
    required this.founderStory,
    required this.overview,
    required this.metrics,
    required this.riskNotes,
    required this.mutualInterest,
  });

  final String id;
  final String name;
  final String sector;
  final String stage;
  final String capitalAsk;
  final String indexBand;
  final String thesis;
  final String founderStory;
  final List<String> overview;
  final List<ScoreMetric> metrics;
  final List<String> riskNotes;
  final bool mutualInterest;
}

class DealUpdate {
  const DealUpdate({
    required this.title,
    required this.detail,
    required this.time,
    this.highlight = false,
  });

  final String title;
  final String detail;
  final String time;
  final bool highlight;
}

class PaymentRecord {
  const PaymentRecord({
    required this.title,
    required this.amount,
    required this.status,
    required this.detail,
  });

  final String title;
  final String amount;
  final String status;
  final String detail;
}

class MarketSignal {
  const MarketSignal({
    required this.ticker,
    required this.company,
    required this.migScore,
    required this.riskIndex,
    required this.recommendation,
    required this.timeHorizon,
    required this.allocation,
    required this.rationale,
  });

  final String ticker;
  final String company;
  final int migScore;
  final int riskIndex;
  final String recommendation;
  final String timeHorizon;
  final String allocation;
  final List<String> rationale;
}

class ReportItem {
  const ReportItem({
    required this.title,
    required this.type,
    required this.timestamp,
  });

  final String title;
  final String type;
  final String timestamp;
}

class AdminQueueItem {
  const AdminQueueItem({
    required this.name,
    required this.role,
    required this.status,
    required this.indexScore,
    required this.scoring,
    required this.flags,
  });

  final String name;
  final AppRole role;
  final String status;
  final int indexScore;
  final List<ScoreMetric> scoring;
  final List<String> flags;
}

class DealTracker {
  const DealTracker({
    required this.founder,
    required this.investor,
    required this.stage,
    required this.feeState,
    required this.lastUpdate,
  });

  final String founder;
  final String investor;
  final String stage;
  final String feeState;
  final String lastUpdate;
}

class GovernanceFlag {
  const GovernanceFlag({
    required this.member,
    required this.issue,
    required this.severity,
    required this.action,
  });

  final String member;
  final String issue;
  final String severity;
  final String action;
}

class RevenueMetric {
  const RevenueMetric({
    required this.label,
    required this.value,
    required this.progress,
  });

  final String label;
  final String value;
  final double progress;
}

class FunnelMetric {
  const FunnelMetric({
    required this.label,
    required this.count,
    required this.note,
  });

  final String label;
  final int count;
  final String note;
}

class SecurityEvent {
  const SecurityEvent({
    required this.title,
    required this.detail,
    required this.time,
  });

  final String title;
  final String detail;
  final String time;
}

class DemoRepository {
  static AppRole? resolveInviteCode(String code) {
    for (final role in AppRole.values) {
      if (role.inviteCode == code.trim().toUpperCase()) {
        return role;
      }
    }
    return null;
  }

  static MonarchSession sessionForRole(
    AppRole role, {
    String? name,
    String? organization,
  }) {
    switch (role) {
      case AppRole.founder:
        return MonarchSession(
          role: role,
          name: name?.isNotEmpty == true ? name! : 'Ariana Vale',
          organization: organization?.isNotEmpty == true
              ? organization!
              : 'HelioForge Labs',
        );
      case AppRole.investor:
        return MonarchSession(
          role: role,
          name: name?.isNotEmpty == true ? name! : 'Noah Mercer',
          organization: organization?.isNotEmpty == true
              ? organization!
              : 'Northpeak Capital',
        );
      case AppRole.admin:
        return const MonarchSession(
          role: AppRole.admin,
          name: 'Monarch Core',
          organization: 'Curation Office',
        );
    }
  }

  static const founderApplicationTimeline = <TimelineStepData>[
    TimelineStepData(
      label: 'Submitted',
      detail: 'Dossier delivered Mar 1',
      complete: true,
    ),
    TimelineStepData(
      label: 'Under Review',
      detail: 'Identity and legitimacy checks in progress',
      complete: true,
      current: true,
    ),
    TimelineStepData(
      label: 'Shortlisted',
      detail: 'Boardroom prep pending documents',
    ),
    TimelineStepData(
      label: 'Boardroom',
      detail: 'Investor curation not yet unlocked',
    ),
    TimelineStepData(
      label: 'In Discussion',
      detail: 'Mutual interest creates the deal room',
    ),
    TimelineStepData(
      label: 'Funded / Closed',
      detail: 'Success-fee triggers are monitored by Monarch',
    ),
  ];

  static const founderCertificationFlow = <TimelineStepData>[
    TimelineStepData(
      label: 'Stage I',
      detail: 'Identity and legitimacy verified',
      complete: true,
    ),
    TimelineStepData(
      label: 'Stage II',
      detail: 'Business fundamentals scored',
      complete: true,
    ),
    TimelineStepData(
      label: 'Stage III',
      detail: 'Monarch Index threshold in review',
      current: true,
    ),
    TimelineStepData(label: 'Stage IV', detail: 'Council curation pending'),
    TimelineStepData(
      label: 'Stage V',
      detail: 'Certification grant if approved',
    ),
  ];

  static const founderScorecard = <ScoreMetric>[
    ScoreMetric('Traction and growth', 85),
    ScoreMetric('Market potential', 78),
    ScoreMetric('Founder capability', 82),
    ScoreMetric('Financial clarity', 69),
    ScoreMetric('Execution readiness', 72),
    ScoreMetric('Risk flags', 28),
  ];

  static const founderActions = <ActionItem>[
    ActionItem(
      title: 'Upload audited revenue schedule',
      detail: 'Required before Boardroom consideration.',
    ),
    ActionItem(
      title: 'Clarify channel retention',
      detail: 'Analyst wants cohort detail by enterprise segment.',
    ),
    ActionItem(
      title: 'Book prep call',
      detail: 'Boardroom storytelling and governance review.',
    ),
    ActionItem(
      title: 'Sign success-fee agreement',
      detail: 'Agreement packet ready for countersign.',
      complete: true,
    ),
  ];

  static const founderMessages = <MessageItem>[
    MessageItem(
      sender: 'Monarch Team',
      preview: 'Your cap table declaration has been accepted.',
      time: '2h ago',
    ),
    MessageItem(
      sender: 'Monarch Team',
      preview: 'Boardroom prep checklist has been added to your action queue.',
      time: 'Yesterday',
    ),
  ];

  static const founderInterests = <DealUpdate>[
    DealUpdate(
      title: 'Anonymous investor interest received',
      detail: 'A late-stage operator syndicate requested a first-look summary.',
      time: '3h ago',
      highlight: true,
    ),
    DealUpdate(
      title: 'Introduction request',
      detail:
          'Monarch can unlock a Boardroom session once diligence files are complete.',
      time: 'Yesterday',
    ),
    DealUpdate(
      title: 'Scheduled prep session',
      detail: 'Thursday, 7:30 PM with Monarch curation lead.',
      time: 'Apr 24',
    ),
  ];

  static const founderDealRoom = <DealUpdate>[
    DealUpdate(
      title: 'Encrypted chat opened',
      detail: 'Monarch-hosted room available after mutual interest.',
      time: 'Pending unlock',
      highlight: true,
    ),
    DealUpdate(
      title: 'Document exchange',
      detail:
          'Room prepared for financial model, customer contracts, and legal memos.',
      time: 'Secure staging',
    ),
    DealUpdate(
      title: 'Activity log',
      detail:
          'Every introduction, file view, and meeting is tracked by Monarch.',
      time: 'Always on',
    ),
  ];

  static const founderPayments = <PaymentRecord>[
    PaymentRecord(
      title: 'Screening fee',
      amount: '\$1,500',
      status: 'Paid',
      detail: 'Receipt issued on Mar 1, 2026.',
    ),
    PaymentRecord(
      title: 'Boardroom preparation advisory',
      amount: '\$4,000',
      status: 'Optional',
      detail: 'Quiet monetization, no subscription obligation.',
    ),
    PaymentRecord(
      title: 'Success-fee agreement',
      amount: '8%',
      status: 'Signed',
      detail: 'Applies only to deals completed through Monarch.',
    ),
  ];

  static const dossierHighlights = <String>[
    'HelioForge turns fragmented industrial energy telemetry into investor-grade operating insight.',
    'Enterprise SaaS with paid pilots across energy, logistics, and climate operators.',
    'Deck version 4 is the active watermarked copy in Monarch storage.',
  ];

  static const dossierRiskNotes = <String>[
    'Customer concentration sits above Monarch comfort band until pilot 4 converts.',
    'Founder-led selling remains a dependency for enterprise close rates.',
    'IP assignment packet is in place but contractor schedules require a final review.',
  ];

  static const boardroomStartups = <StartupSummary>[
    StartupSummary(
      id: 'atlas-rail',
      name: 'Atlas Rail',
      sector: 'Infrastructure',
      stage: 'Series A',
      capitalAsk: '\$6.5M',
      indexBand: '78 - 84',
      thesis: 'Infrastructure rails for private capital orchestration.',
      founderStory:
          'Atlas Rail was built by former fund operations leaders who spent a decade rebuilding the same reporting pipelines by hand.',
      overview: [
        'Revenue run-rate is growing 24% QoQ with two enterprise upsells in progress.',
        'Product is already embedded inside diligence, reporting, and investor communications workflows.',
        'Monarch notes a disciplined governance mindset and strong customer references.',
      ],
      metrics: [
        ScoreMetric('Revenue growth', 84),
        ScoreMetric('Customer proof', 76),
        ScoreMetric('Execution readiness', 81),
      ],
      riskNotes: [
        'Sales cycle length still depends on CFO sponsorship.',
        'International expansion assumptions need tighter support.',
      ],
      mutualInterest: true,
    ),
    StartupSummary(
      id: 'lattice-credit',
      name: 'Lattice Credit',
      sector: 'AI',
      stage: 'Seed',
      capitalAsk: '\$2.1M',
      indexBand: '70 - 76',
      thesis: 'Agentic underwriting for underserved emerging-market lenders.',
      founderStory:
          'The founder team blends fintech operations, risk science, and region-specific regulatory experience.',
      overview: [
        'Pilot default-rate variance improved by 18% in live lender cohorts.',
        'Strong regulatory posture with clear data-consent controls.',
        'Monarch sees high upside but wants more evidence of repeatable deployment.',
      ],
      metrics: [
        ScoreMetric('Traction', 71),
        ScoreMetric('Market size', 83),
        ScoreMetric('Risk management', 68),
      ],
      riskNotes: [
        'Collections workflow still depends on services support.',
        'Currency exposure should be monitored as expansion broadens.',
      ],
      mutualInterest: false,
    ),
    StartupSummary(
      id: 'carbon-layer',
      name: 'CarbonLayer',
      sector: 'Climate',
      stage: 'Series B',
      capitalAsk: '\$12M',
      indexBand: '82 - 88',
      thesis: 'Grid analytics reducing industrial energy variance.',
      founderStory:
          'CarbonLayer grew from a utility analytics team into a full-stack risk intelligence platform for heavy industry.',
      overview: [
        'Multi-site deployments already lower energy variance for industrial operators.',
        'Renewal behavior is strong and gross margins improve after implementation quarter one.',
        'Monarch flags the company as one of the strongest Boardroom candidates this month.',
      ],
      metrics: [
        ScoreMetric('Growth durability', 87),
        ScoreMetric('Capital efficiency', 74),
        ScoreMetric('Governance readiness', 86),
      ],
      riskNotes: [
        'Long procurement cycles remain the main drag on velocity.',
        'Hardware-adjacent integrations raise implementation complexity.',
      ],
      mutualInterest: true,
    ),
  ];

  static const marketSignals = <MarketSignal>[
    MarketSignal(
      ticker: 'NVDA',
      company: 'NVIDIA',
      migScore: 92,
      riskIndex: 4,
      recommendation: 'Highly Recommended',
      timeHorizon: '12-18 months',
      allocation: '8% - 11%',
      rationale: [
        'AI infrastructure demand remains structurally ahead of supply.',
        'Gross margin resilience supports premium multiple retention.',
        'Execution risk is manageable relative to opportunity set.',
      ],
    ),
    MarketSignal(
      ticker: 'ASML',
      company: 'ASML Holding',
      migScore: 88,
      riskIndex: 5,
      recommendation: 'Recommended',
      timeHorizon: '18-24 months',
      allocation: '6% - 8%',
      rationale: [
        'Semiconductor tooling leadership creates durable pricing power.',
        'Supply chain normalization improves delivery confidence.',
        'Monarch expects continued strategic dependence from leading fabs.',
      ],
    ),
    MarketSignal(
      ticker: 'MDB',
      company: 'MongoDB',
      migScore: 77,
      riskIndex: 6,
      recommendation: 'Neutral',
      timeHorizon: '9-12 months',
      allocation: '3% - 5%',
      rationale: [
        'Developer platform strength remains meaningful.',
        'Near-term multiple sensitivity is higher than the top picks.',
        'Worth monitoring if enterprise expansions keep compounding.',
      ],
    ),
  ];

  static const reports = <ReportItem>[
    ReportItem(
      title: 'Weekly Boardroom Summary',
      type: 'Briefing',
      timestamp: 'Apr 22, 2026',
    ),
    ReportItem(
      title: 'Private Markets Signal Deck',
      type: 'PDF',
      timestamp: 'Apr 18, 2026',
    ),
    ReportItem(
      title: 'North America AI Infrastructure Note',
      type: 'Sector Deep Dive',
      timestamp: 'Apr 14, 2026',
    ),
  ];

  static const securityEvents = <SecurityEvent>[
    SecurityEvent(
      title: 'New device approved',
      detail: 'iPhone 15 Pro, Mumbai',
      time: 'Today',
    ),
    SecurityEvent(
      title: 'NDA reaffirmed',
      detail: 'Session access token rotated after Boardroom visit.',
      time: 'Yesterday',
    ),
    SecurityEvent(
      title: 'Activity review',
      detail: 'No external contact details exposed off-platform.',
      time: 'Apr 19',
    ),
  ];

  static const adminQueue = <AdminQueueItem>[
    AdminQueueItem(
      name: 'Alice Warren',
      role: AppRole.founder,
      status: 'Under review',
      indexScore: 79,
      scoring: [
        ScoreMetric('Traction', 82),
        ScoreMetric('Market', 77),
        ScoreMetric('Founder', 85),
        ScoreMetric('Financial', 69),
        ScoreMetric('Execution', 80),
      ],
      flags: [
        'Cap table declaration requires one spot check.',
        'Deck revision submitted after initial review.',
      ],
    ),
    AdminQueueItem(
      name: 'Leo Park',
      role: AppRole.investor,
      status: 'Pending NDA',
      indexScore: 0,
      scoring: [
        ScoreMetric('Background', 74),
        ScoreMetric('Sector fit', 79),
        ScoreMetric('Governance', 71),
      ],
      flags: ['Access tier limited until NDA is countersigned.'],
    ),
  ];

  static const dealTrackers = <DealTracker>[
    DealTracker(
      founder: 'Atlas Rail',
      investor: 'Helios Capital',
      stage: 'Boardroom',
      feeState: 'Pending',
      lastUpdate: '2h ago',
    ),
    DealTracker(
      founder: 'CarbonLayer',
      investor: 'Northpeak',
      stage: 'Term sheet',
      feeState: 'Triggered',
      lastUpdate: 'Yesterday',
    ),
    DealTracker(
      founder: 'HelioForge Labs',
      investor: 'Operator Syndicate',
      stage: 'Intro requested',
      feeState: 'Monitoring',
      lastUpdate: 'Today',
    ),
  ];

  static const governanceFlags = <GovernanceFlag>[
    GovernanceFlag(
      member: 'Evan Shaw',
      issue: 'Anti-circumvention flag triggered after off-platform outreach.',
      severity: 'High',
      action: 'Blacklisted',
    ),
    GovernanceFlag(
      member: 'Lumen Growth',
      issue: 'Repeated dossier access without NDA refresh.',
      severity: 'Medium',
      action: 'Suspended',
    ),
  ];

  static const revenueMetrics = <RevenueMetric>[
    RevenueMetric(label: 'Screening fees', value: '\$120k', progress: 0.82),
    RevenueMetric(label: 'Boardroom access', value: '\$84k', progress: 0.58),
    RevenueMetric(label: 'Custom reports', value: '\$42k', progress: 0.31),
    RevenueMetric(label: 'Algorithm access', value: '\$36k', progress: 0.24),
  ];

  static const funnelMetrics = <FunnelMetric>[
    FunnelMetric(label: 'Requests', count: 420, note: 'Inbound applications'),
    FunnelMetric(label: 'Verified', count: 260, note: 'Identity passed'),
    FunnelMetric(label: 'Dossiers', count: 180, note: 'Structured submissions'),
    FunnelMetric(label: 'Shortlisted', count: 90, note: 'Threshold crossed'),
    FunnelMetric(label: 'Boardroom', count: 55, note: 'Investor-ready'),
    FunnelMetric(label: 'Funded', count: 18, note: 'Monarch-supported closes'),
  ];
}
