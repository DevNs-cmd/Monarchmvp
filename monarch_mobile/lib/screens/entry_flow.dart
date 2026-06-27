import 'package:flutter/material.dart';

import '../data/demo_models.dart';
import '../theme/monarch_theme.dart';
import '../widgets/monarch_widgets.dart';

enum EntryMode { invite, request }

class EntryFlow extends StatefulWidget {
  const EntryFlow({super.key, required this.onAuthenticated});

  final ValueChanged<MonarchSession> onAuthenticated;

  @override
  State<EntryFlow> createState() => _EntryFlowState();
}

class _EntryFlowState extends State<EntryFlow> {
  EntryMode? _mode;
  AppRole? _selectedRole;
  bool _otpVerified = false;
  String _inviteCode = '';
  String _inviteError = '';
  String _requestName = '';
  String _requestEmail = '';
  String _requestLinkedIn = '';

  void _selectMode(EntryMode mode) {
    setState(() {
      _mode = mode;
      _selectedRole = null;
      _inviteCode = '';
      _inviteError = '';
      _otpVerified = false;
    });
  }

  void _selectRole(AppRole role) {
    if (_mode == EntryMode.request && role == AppRole.admin) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Monarch Core access is invite-only.')),
      );
      return;
    }
    setState(() {
      _selectedRole = role;
      _inviteError = '';
      _otpVerified = false;
    });
  }

  void _submitInvite() {
    final role = DemoRepository.resolveInviteCode(_inviteCode);
    if (role == null) {
      setState(() {
        _inviteError = 'Invite code not recognized.';
      });
      return;
    }
    if (role != _selectedRole) {
      setState(() {
        _inviteError =
            'This code belongs to ${role.label}. Please switch roles or use the matching code.';
      });
      return;
    }
    setState(() {
      _inviteError = '';
      _otpVerified = true;
    });
  }

  void _submitRequest() {
    if (_requestName.trim().isEmpty ||
        _requestEmail.trim().isEmpty ||
        _requestLinkedIn.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please complete all request access fields.'),
        ),
      );
      return;
    }
    setState(() {
      _otpVerified = true;
    });
  }

  void _completeFounderOnboarding({
    required String founderName,
    required String companyName,
  }) {
    widget.onAuthenticated(
      DemoRepository.sessionForRole(
        AppRole.founder,
        name: founderName,
        organization: companyName,
      ),
    );
  }

  void _completeInvestorOnboarding({
    required String investorName,
    required String organization,
  }) {
    widget.onAuthenticated(
      DemoRepository.sessionForRole(
        AppRole.investor,
        name: investorName,
        organization: organization,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_mode == null) {
      return _LandingScreen(onModeSelected: _selectMode);
    }

    if (_selectedRole == null) {
      return _RoleSelectionScreen(
        mode: _mode!,
        onBack: () => setState(() => _mode = null),
        onRoleSelected: _selectRole,
      );
    }

    if (!_otpVerified) {
      if (_mode == EntryMode.invite) {
        return _InviteCodeScreen(
          role: _selectedRole!,
          inviteCode: _inviteCode,
          inviteError: _inviteError,
          onChanged: (value) => setState(() => _inviteCode = value),
          onBack: () => setState(() => _selectedRole = null),
          onContinue: _submitInvite,
        );
      }
      return _RequestAccessScreen(
        role: _selectedRole!,
        name: _requestName,
        email: _requestEmail,
        linkedIn: _requestLinkedIn,
        onNameChanged: (value) => setState(() => _requestName = value),
        onEmailChanged: (value) => setState(() => _requestEmail = value),
        onLinkedInChanged: (value) => setState(() => _requestLinkedIn = value),
        onBack: () => setState(() => _selectedRole = null),
        onContinue: _submitRequest,
      );
    }

    if (_mode == EntryMode.request) {
      return _RequestSubmittedScreen(
        role: _selectedRole!,
        onBackToStart: () {
          setState(() {
            _mode = null;
            _selectedRole = null;
            _otpVerified = false;
          });
        },
      );
    }

    if (_selectedRole == AppRole.founder) {
      return FounderOnboardingScreen(
        initialName: _requestName,
        onFinished: _completeFounderOnboarding,
      );
    }
    if (_selectedRole == AppRole.investor) {
      return InvestorOnboardingScreen(
        initialName: _requestName,
        onFinished: _completeInvestorOnboarding,
      );
    }

    return _AdminAccessScreen(
      onEnter: () =>
          widget.onAuthenticated(DemoRepository.sessionForRole(AppRole.admin)),
    );
  }
}

class _LandingScreen extends StatelessWidget {
  const _LandingScreen({required this.onModeSelected});

  final ValueChanged<EntryMode> onModeSelected;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: MonarchColors.black,
      body: MonarchBackground(
        child: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              final topGap = constraints.maxHeight > 720 ? 54.0 : 26.0;
              return SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(22, 24, 22, 24),
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: constraints.maxHeight - 48,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(height: topGap),
                      const MonarchLogoMark(size: 112),
                      const SizedBox(height: 26),
                      Text('Monarch', style: theme.textTheme.headlineLarge),
                      const SizedBox(height: 12),
                      Text(
                        'Private opportunities. Intelligent curation. Multi-asset trust.',
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: MonarchColors.muted,
                        ),
                      ),
                      const SizedBox(height: 26),
                      MonarchPanel(
                        accent: true,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Curated access, clean rooms, and verified deal flow in one private interface.',
                              style: theme.textTheme.titleMedium,
                            ),
                            const SizedBox(height: 16),
                            const Wrap(
                              spacing: 10,
                              runSpacing: 10,
                              children: [
                                MonarchTag(label: 'Invite gated'),
                                MonarchTag(
                                  label: 'Private markets',
                                  tone: TagTone.gold,
                                ),
                                MonarchTag(
                                  label: 'Verified trust',
                                  tone: TagTone.success,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 22),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () =>
                                  onModeSelected(EntryMode.request),
                              child: const Text('Request access'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => onModeSelected(EntryMode.invite),
                              child: const Text('Enter invite'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Everything feels earned. Nothing is publicly browsable.',
                        style: theme.textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

class _RoleSelectionScreen extends StatelessWidget {
  const _RoleSelectionScreen({
    required this.mode,
    required this.onBack,
    required this.onRoleSelected,
  });

  final EntryMode mode;
  final VoidCallback onBack;
  final ValueChanged<AppRole> onRoleSelected;

  @override
  Widget build(BuildContext context) {
    return MonarchPage(
      eyebrow: 'ACCESS PATH',
      title: 'Choose your interface',
      subtitle: 'Access is curated. Applications are reviewed.',
      actions: [
        IconButton(onPressed: onBack, icon: const Icon(Icons.arrow_back)),
      ],
      child: Column(
        children: [
          for (final role in AppRole.values) ...[
            _RoleCard(
              role: role,
              mode: mode,
              onTap: () => onRoleSelected(role),
            ),
            const SizedBox(height: 14),
          ],
        ],
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  const _RoleCard({
    required this.role,
    required this.mode,
    required this.onTap,
  });

  final AppRole role;
  final EntryMode mode;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isLocked = role == AppRole.admin && mode == EntryMode.request;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: MonarchPanel(
        accent: !isLocked,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                color: MonarchColors.gold.withValues(alpha: 0.12),
              ),
              alignment: Alignment.center,
              child: Icon(role.icon, color: MonarchColors.goldSoft),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          role.label,
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                      ),
                      if (isLocked)
                        const MonarchTag(
                          label: 'Invite only',
                          tone: TagTone.warning,
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    role.description,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Sample code: ${role.inviteCode}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: MonarchColors.goldSoft,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InviteCodeScreen extends StatelessWidget {
  const _InviteCodeScreen({
    required this.role,
    required this.inviteCode,
    required this.inviteError,
    required this.onChanged,
    required this.onBack,
    required this.onContinue,
  });

  final AppRole role;
  final String inviteCode;
  final String inviteError;
  final ValueChanged<String> onChanged;
  final VoidCallback onBack;
  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) {
    return MonarchPage(
      eyebrow: 'INVITE ACCESS',
      title: role.label,
      subtitle: 'Use a verified invite to unlock your private flow.',
      actions: [
        IconButton(onPressed: onBack, icon: const Icon(Icons.arrow_back)),
      ],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          MonarchPanel(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  onChanged: onChanged,
                  textCapitalization: TextCapitalization.characters,
                  decoration: InputDecoration(
                    labelText: 'Invite code',
                    hintText: role.inviteCode,
                    errorText: inviteError.isEmpty ? null : inviteError,
                  ),
                ),
                const SizedBox(height: 18),
                Text(
                  'Monarch validates role, identity, and intended interface before access is granted.',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          ElevatedButton(
            onPressed: onContinue,
            child: const Text('Verify access'),
          ),
        ],
      ),
    );
  }
}

class _RequestAccessScreen extends StatelessWidget {
  const _RequestAccessScreen({
    required this.role,
    required this.name,
    required this.email,
    required this.linkedIn,
    required this.onNameChanged,
    required this.onEmailChanged,
    required this.onLinkedInChanged,
    required this.onBack,
    required this.onContinue,
  });

  final AppRole role;
  final String name;
  final String email;
  final String linkedIn;
  final ValueChanged<String> onNameChanged;
  final ValueChanged<String> onEmailChanged;
  final ValueChanged<String> onLinkedInChanged;
  final VoidCallback onBack;
  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) {
    return MonarchPage(
      eyebrow: 'REQUEST ACCESS',
      title: role.label,
      subtitle: 'Selective entry keeps the ecosystem private and credible.',
      actions: [
        IconButton(onPressed: onBack, icon: const Icon(Icons.arrow_back)),
      ],
      child: Column(
        children: [
          MonarchPanel(
            child: Column(
              children: [
                _BoundField(
                  label: 'Name',
                  value: name,
                  onChanged: onNameChanged,
                ),
                const SizedBox(height: 12),
                _BoundField(
                  label: 'Email',
                  value: email,
                  onChanged: onEmailChanged,
                ),
                const SizedBox(height: 12),
                _BoundField(
                  label: 'LinkedIn URL',
                  value: linkedIn,
                  onChanged: onLinkedInChanged,
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          ElevatedButton(
            onPressed: onContinue,
            child: const Text('Submit for review'),
          ),
        ],
      ),
    );
  }
}

class _RequestSubmittedScreen extends StatelessWidget {
  const _RequestSubmittedScreen({
    required this.role,
    required this.onBackToStart,
  });

  final AppRole role;
  final VoidCallback onBackToStart;

  @override
  Widget build(BuildContext context) {
    return MonarchPage(
      eyebrow: 'REQUEST RECEIVED',
      title: 'Application submitted',
      subtitle: role.label,
      child: Column(
        children: [
          MonarchPanel(
            child: Column(
              children: [
                const Icon(
                  Icons.check_circle_outline,
                  size: 64,
                  color: MonarchColors.gold,
                ),
                const SizedBox(height: 18),
                Text(
                  'Your request has been received. If aligned, access will be extended.',
                  style: Theme.of(context).textTheme.titleMedium,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                Text(
                  'Monarch reviews identity, role alignment, credibility, and fit before activating any access.',
                  style: Theme.of(context).textTheme.bodySmall,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          OutlinedButton(
            onPressed: onBackToStart,
            child: const Text('Back to landing'),
          ),
        ],
      ),
    );
  }
}

class _AdminAccessScreen extends StatelessWidget {
  const _AdminAccessScreen({required this.onEnter});

  final VoidCallback onEnter;

  @override
  Widget build(BuildContext context) {
    return MonarchPage(
      eyebrow: 'MONARCH CORE',
      title: 'Verified internal access',
      subtitle: 'Admin always sits above the ecosystem.',
      child: Column(
        children: [
          const MonarchPanel(
            child: MonarchBulletList(
              items: [
                'Application queues, scoring, and curation controls are active.',
                'Deal introductions, fee triggers, and governance events are monitored.',
                'Market signal approvals and overrides stay under Monarch control.',
              ],
            ),
          ),
          const SizedBox(height: 18),
          ElevatedButton(
            onPressed: onEnter,
            child: const Text('Enter Monarch Core'),
          ),
        ],
      ),
    );
  }
}

class FounderOnboardingScreen extends StatefulWidget {
  const FounderOnboardingScreen({
    super.key,
    required this.initialName,
    required this.onFinished,
  });

  final String initialName;
  final void Function({
    required String founderName,
    required String companyName,
  })
  onFinished;

  @override
  State<FounderOnboardingScreen> createState() =>
      _FounderOnboardingScreenState();
}

class _FounderOnboardingScreenState extends State<FounderOnboardingScreen> {
  int _step = 0;
  late String _name = widget.initialName;
  String _email = '';
  String _company = 'HelioForge Labs';
  String _pitch = '';
  String _industry = 'Energy intelligence';
  String _mrr = '\$145k';
  String _growth = '24% QoQ';
  String _proof = '3 enterprise pilots, 2 paid renewals';
  String _capitalAsk = '\$3.5M';
  String _valuation = '\$18M pre-money';
  String _stage = 'Seed';
  bool _deckReady = true;
  bool _submitted = false;

  @override
  Widget build(BuildContext context) {
    if (_submitted) {
      return MonarchPage(
        eyebrow: 'UNDER REVIEW',
        title: 'Profile submitted',
        subtitle: 'Your profile is under Monarch review.',
        child: Column(
          children: [
            const MonarchPanel(
              child: MonarchBulletList(
                items: [
                  'Identity, legitimacy, and business fundamentals are now being reviewed.',
                  'Monarch messages will guide the next required actions.',
                  'No investor DMs unlock until Monarch advances the process.',
                ],
              ),
            ),
            const SizedBox(height: 18),
            ElevatedButton(
              onPressed: () =>
                  widget.onFinished(founderName: _name, companyName: _company),
              child: const Text('Continue to founder dashboard'),
            ),
          ],
        ),
      );
    }

    const steps = [
      'Company snapshot',
      'Traction and metrics',
      'Capital ask',
      'Deck upload',
      'Review and submit',
    ];
    return MonarchPage(
      eyebrow: 'FOUNDER ONBOARDING',
      title: 'Prepare your Monarch dossier',
      subtitle: 'Step ${_step + 1} of ${steps.length}',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          MonarchPanel(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  steps[_step],
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 10),
                _ProgressDots(count: steps.length, activeIndex: _step),
                const SizedBox(height: 18),
                ..._buildFounderStep(context),
              ],
            ),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              if (_step > 0)
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => setState(() => _step -= 1),
                    child: const Text('Previous'),
                  ),
                ),
              if (_step > 0) const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    if (_step == steps.length - 1) {
                      setState(() => _submitted = true);
                    } else {
                      setState(() => _step += 1);
                    }
                  },
                  child: Text(
                    _step == steps.length - 1 ? 'Submit' : 'Continue',
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  List<Widget> _buildFounderStep(BuildContext context) {
    switch (_step) {
      case 0:
        return [
          _BoundField(
            label: 'Founder name',
            value: _name,
            onChanged: (value) => setState(() => _name = value),
          ),
          const SizedBox(height: 12),
          _BoundField(
            label: 'Professional email',
            value: _email,
            onChanged: (value) => setState(() => _email = value),
          ),
          const SizedBox(height: 12),
          _BoundField(
            label: 'Company name',
            value: _company,
            onChanged: (value) => setState(() => _company = value),
          ),
          const SizedBox(height: 12),
          _BoundField(
            label: 'One-line thesis',
            value: _pitch,
            maxLines: 3,
            onChanged: (value) => setState(() => _pitch = value),
          ),
          const SizedBox(height: 12),
          _BoundField(
            label: 'Industry / sector',
            value: _industry,
            onChanged: (value) => setState(() => _industry = value),
          ),
        ];
      case 1:
        return [
          _BoundField(
            label: 'Revenue',
            value: _mrr,
            onChanged: (value) => setState(() => _mrr = value),
          ),
          const SizedBox(height: 12),
          _BoundField(
            label: 'Growth',
            value: _growth,
            onChanged: (value) => setState(() => _growth = value),
          ),
          const SizedBox(height: 12),
          _BoundField(
            label: 'Customer proof',
            value: _proof,
            maxLines: 3,
            onChanged: (value) => setState(() => _proof = value),
          ),
        ];
      case 2:
        return [
          _BoundField(
            label: 'Capital ask',
            value: _capitalAsk,
            onChanged: (value) => setState(() => _capitalAsk = value),
          ),
          const SizedBox(height: 12),
          _BoundField(
            label: 'Valuation',
            value: _valuation,
            onChanged: (value) => setState(() => _valuation = value),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            initialValue: _stage,
            decoration: const InputDecoration(labelText: 'Stage'),
            items: const [
              DropdownMenuItem(value: 'Seed', child: Text('Seed')),
              DropdownMenuItem(value: 'Series A', child: Text('Series A')),
              DropdownMenuItem(value: 'Series B', child: Text('Series B')),
            ],
            onChanged: (value) {
              if (value != null) {
                setState(() => _stage = value);
              }
            },
          ),
        ];
      case 3:
        return [
          MonarchPanel(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(
                  _deckReady
                      ? Icons.picture_as_pdf_outlined
                      : Icons.upload_file,
                  color: MonarchColors.gold,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    _deckReady
                        ? 'Deck uploaded and ready for virus scan and secure storage.'
                        : 'Upload a watermarked PDF deck.',
                  ),
                ),
                Switch(
                  value: _deckReady,
                  activeThumbColor: MonarchColors.gold,
                  onChanged: (value) => setState(() => _deckReady = value),
                ),
              ],
            ),
          ),
        ];
      default:
        return [
          MonarchBulletList(
            items: [
              '$_company | $_industry | $_stage',
              'Revenue: $_mrr | Growth: $_growth',
              'Capital ask: $_capitalAsk | Valuation: $_valuation',
              'Deck status: ${_deckReady ? 'Uploaded' : 'Missing'}',
              'Founder story: ${_pitch.isEmpty ? 'Pending summary' : _pitch}',
            ],
          ),
        ];
    }
  }
}

class InvestorOnboardingScreen extends StatefulWidget {
  const InvestorOnboardingScreen({
    super.key,
    required this.initialName,
    required this.onFinished,
  });

  final String initialName;
  final void Function({
    required String investorName,
    required String organization,
  })
  onFinished;

  @override
  State<InvestorOnboardingScreen> createState() =>
      _InvestorOnboardingScreenState();
}

class _InvestorOnboardingScreenState extends State<InvestorOnboardingScreen> {
  int _step = 0;
  late String _name = widget.initialName;
  String _organization = 'Northpeak Capital';
  String _background = 'Growth equity and operating leverage in B2B software';
  String _interests = 'AI, climate, infrastructure';
  String _capitalRange = '\$500k - \$8M';
  String _ndaState = 'Accepted';
  bool _submitted = false;

  @override
  Widget build(BuildContext context) {
    if (_submitted) {
      return MonarchPage(
        eyebrow: 'ACCESS GRANTED',
        title: 'Welcome to Monarch',
        subtitle: 'Your investor interface is now active.',
        child: Column(
          children: [
            const MonarchPanel(
              child: MonarchBulletList(
                items: [
                  'Boardroom access shows only vetted startups and private dossiers.',
                  'Markets intelligence includes MIG picks, risk radar, and report requests.',
                  'Direct contact stays locked until Monarch authorizes the deal room.',
                ],
              ),
            ),
            const SizedBox(height: 18),
            ElevatedButton(
              onPressed: () => widget.onFinished(
                investorName: _name,
                organization: _organization,
              ),
              child: const Text('Continue to investor dashboard'),
            ),
          ],
        ),
      );
    }

    const steps = [
      'Professional background',
      'Investment interests',
      'Capital range',
      'Confidentiality agreement',
    ];
    return MonarchPage(
      eyebrow: 'INVESTOR ONBOARDING',
      title: 'Set your Monarch lens',
      subtitle: 'Step ${_step + 1} of ${steps.length}',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          MonarchPanel(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  steps[_step],
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 10),
                _ProgressDots(count: steps.length, activeIndex: _step),
                const SizedBox(height: 18),
                ..._buildInvestorStep(),
              ],
            ),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              if (_step > 0)
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => setState(() => _step -= 1),
                    child: const Text('Previous'),
                  ),
                ),
              if (_step > 0) const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    if (_step == steps.length - 1) {
                      setState(() => _submitted = true);
                    } else {
                      setState(() => _step += 1);
                    }
                  },
                  child: Text(
                    _step == steps.length - 1 ? 'Finish' : 'Continue',
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  List<Widget> _buildInvestorStep() {
    switch (_step) {
      case 0:
        return [
          _BoundField(
            label: 'Name',
            value: _name,
            onChanged: (value) => setState(() => _name = value),
          ),
          const SizedBox(height: 12),
          _BoundField(
            label: 'Firm / organization',
            value: _organization,
            onChanged: (value) => setState(() => _organization = value),
          ),
          const SizedBox(height: 12),
          _BoundField(
            label: 'Professional background',
            value: _background,
            maxLines: 3,
            onChanged: (value) => setState(() => _background = value),
          ),
        ];
      case 1:
        return [
          _BoundField(
            label: 'Sector interests',
            value: _interests,
            onChanged: (value) => setState(() => _interests = value),
          ),
        ];
      case 2:
        return [
          _BoundField(
            label: 'Capital range / strategic appetite',
            value: _capitalRange,
            onChanged: (value) => setState(() => _capitalRange = value),
          ),
        ];
      default:
        return [
          MonarchPanel(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                const Icon(Icons.gavel_outlined, color: MonarchColors.gold),
                const SizedBox(width: 12),
                const Expanded(
                  child: Text(
                    'NDA, access controls, and anti-circumvention obligations are active.',
                  ),
                ),
                DropdownButton<String>(
                  value: _ndaState,
                  items: const [
                    DropdownMenuItem(
                      value: 'Accepted',
                      child: Text('Accepted'),
                    ),
                    DropdownMenuItem(value: 'Pending', child: Text('Pending')),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() => _ndaState = value);
                    }
                  },
                ),
              ],
            ),
          ),
        ];
    }
  }
}

class _ProgressDots extends StatelessWidget {
  const _ProgressDots({required this.count, required this.activeIndex});

  final int count;
  final int activeIndex;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(
        count,
        (index) => Expanded(
          child: Container(
            margin: EdgeInsets.only(right: index == count - 1 ? 0 : 8),
            height: 6,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(999),
              color: index <= activeIndex
                  ? MonarchColors.gold
                  : MonarchColors.surfaceMuted,
            ),
          ),
        ),
      ),
    );
  }
}

class _BoundField extends StatelessWidget {
  const _BoundField({
    required this.label,
    required this.value,
    required this.onChanged,
    this.maxLines = 1,
  });

  final String label;
  final String value;
  final ValueChanged<String> onChanged;
  final int maxLines;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      initialValue: value,
      maxLines: maxLines,
      onChanged: onChanged,
      decoration: InputDecoration(labelText: label),
    );
  }
}
