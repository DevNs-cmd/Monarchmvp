import 'package:flutter/material.dart';

import 'data/demo_models.dart';
import 'screens/admin_shell.dart';
import 'screens/entry_flow.dart';
import 'screens/founder_shell.dart';
import 'screens/investor_shell.dart';
import 'theme/monarch_theme.dart';

class MonarchMobileApp extends StatefulWidget {
  const MonarchMobileApp({super.key});

  @override
  State<MonarchMobileApp> createState() => _MonarchMobileAppState();
}

class _MonarchMobileAppState extends State<MonarchMobileApp> {
  MonarchSession? _session;

  void _startSession(MonarchSession session) {
    setState(() {
      _session = session;
    });
  }

  void _endSession() {
    setState(() {
      _session = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Monarch',
      debugShowCheckedModeBanner: false,
      theme: buildMonarchTheme(),
      home: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: _session == null
            ? EntryFlow(
                key: const ValueKey('entry'),
                onAuthenticated: _startSession,
              )
            : _RoleRouter(
                key: ValueKey(_session!.role.name),
                session: _session!,
                onSignOut: _endSession,
              ),
      ),
    );
  }
}

class _RoleRouter extends StatelessWidget {
  const _RoleRouter({
    super.key,
    required this.session,
    required this.onSignOut,
  });

  final MonarchSession session;
  final VoidCallback onSignOut;

  @override
  Widget build(BuildContext context) {
    switch (session.role) {
      case AppRole.founder:
        return FounderShell(session: session, onSignOut: onSignOut);
      case AppRole.investor:
        return InvestorShell(session: session, onSignOut: onSignOut);
      case AppRole.admin:
        return AdminShell(session: session, onSignOut: onSignOut);
    }
  }
}
