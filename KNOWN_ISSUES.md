# Known Issues and Incomplete Items

This document is a verification checklist, not a claim that every item below is currently broken. Update it after the final test pass. Remove resolved items and add any issues discovered during testing.

## Items to verify before submission

1. **Dashboard statistics:** Some dashboard summary values were previously hardcoded sample values. Confirm whether all displayed totals/revenue are connected to live report APIs. If not, label them as sample/demo data or list this limitation.
2. **Search and pagination:** Search/pagination was reported as partially implemented. Verify behavior on each listing page, including page boundaries and empty search results.
3. **Rate limiting:** Confirm `express-rate-limit` is installed, middleware is mounted on the intended routes, and login limits are effective.
4. **Model update validation:** Verify update controllers use `runValidators: true` where appropriate.
5. **Duplicate-key handling:** Verify duplicate Student email/ID and duplicate Enrollment pairs return user-friendly errors.
6. **File upload:** Verify file type, file size, filename handling, and unauthorized upload behavior.
7. **Email delivery:** Verify Gmail App Password configuration and failure handling. Email delivery depends on external account configuration.
8. **Production deployment:** No production deployment was confirmed in the project history.
9. **Frontend automated tests:** Backend Jest/Supertest tests were reported; frontend automated test coverage was not confirmed.

## Final test record
- Test command: `cd server && npm test`
- Final run date: `<ADD_DATE>`
- Test suites passed: `<ADD_RESULT>`
- Tests passed: `<ADD_RESULT>`
- Tests failed: `<ADD_RESULT>`

## Submission note
Only retain issues that are still present. If no known issues remain after testing, replace this list with: “No known blocking issues at the time of submission; see final test evidence.” Do not claim a complete production security/performance audit unless one was performed.
