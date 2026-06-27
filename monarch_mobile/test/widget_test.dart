import 'package:flutter_test/flutter_test.dart';
import 'package:monarch_mobile/monarch_app.dart';

void main() {
  testWidgets('renders Monarch landing flow', (tester) async {
    await tester.pumpWidget(const MonarchMobileApp());

    expect(find.text('Monarch'), findsOneWidget);
    expect(find.text('Request access'), findsOneWidget);
    expect(find.text('Enter invite'), findsOneWidget);
  });
}
