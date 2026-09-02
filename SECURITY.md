# Security Policy

Primero takes the security and privacy of its users seriously. Primero is a Digital Public Good used by organizations supporting vulnerable populations, including children and survivors of violence. We welcome responsible security research that helps us identify and address security vulnerabilities.

## Reporting

Security vulnerabilities must be reported privately to:

**childprotectioninnovation@gmail.com**

Please do not disclose suspected vulnerabilities through public GitHub issues, pull requests, discussions, social media, or other public channels before the Primero maintainers have had a reasonable opportunity to investigate and address the issue.

We ask security researchers to follow these principles when investigating and reporting vulnerabilities:

- **Act in good faith.** Security research should be intended to improve the security of Primero and protect its users.
- **Use your own environment and data.** Whenever possible, reproduce vulnerabilities using a locally deployed instance of Primero and synthetic test data.
- **Do not access production systems without authorization.** Do not test Primero deployments operated by UNICEF, governments, NGOs, Primero partners, or other organizations unless you have their explicit permission.
- **Protect sensitive data.** Do not intentionally access, copy, modify, download, retain, or disclose personal or confidential information belonging to other users. If you unexpectedly encounter such information, stop testing and notify us.
- **Minimize impact.** Do not perform denial-of-service testing, destructive actions, excessive automated scanning, or other activity that could degrade the availability or integrity of a Primero system.
- **Do not use social engineering.** Reports should concern vulnerabilities in Primero software rather than attempts to deceive Primero users, administrators, maintainers, or partner organizations.
- **Allow time for remediation.** Please give the maintainers a reasonable opportunity to investigate, develop, test, and distribute a fix before publicly disclosing a vulnerability. We are  project with limited resources.
- **Do not use vulnerability disclosure as leverage.** Do not threaten disclosure, data release, service disruption, or other harm in order to obtain payment or other consideration.

Again, Primero is an open source Digital Public Goods project with limited resources. **This is not a bug bounty program, and we cannot guarantee financial compensation for vulnerability reports.**

Validated vulnerabilities will be tracked through a private GitHub Security Advisory (GHSA). At the researcher’s request, the advisory may credit them for the finding.

## Report Requirements

A security report should contain enough information for the Primero maintainers to independently understand, reproduce, and validate the vulnerability.

Reports must include:

1. **Description of the vulnerability and exploit**

   Describe the vulnerability, how it can be exploited, and the conditions required for exploitation. Include the relevant application functionality, endpoints, source files, configuration, roles, or permissions where applicable.

2. **Security boundaries violated**

   Clearly identify which security boundary or security property is violated and what an attacker is able to do as a result.

   Examples include:

   - An unauthenticated user gaining access to authenticated functionality.
   - A user accessing records belonging to another user, agency, or organization.
   - A user performing an operation that their assigned role or permissions should prohibit.
   - Disclosure of confidential information.
   - Modification or deletion of data without the required authorization.
   - Execution of code or commands outside of the privileges intended by the application.
   - Bypassing authentication, authorization, tenant, agency, or record-level access controls.

   A report should distinguish between unexpected application behavior and behavior that creates a meaningful security boundary violation.

3. **Reproduction on the `main` branch**

   The vulnerability must be reproducible against the current `main` branch of the Primero repository.

   Please identify the commit SHA used for testing and provide any configuration or setup steps necessary to reproduce the issue.

4. **Proof of concept or failing test**

   Provide at least one of the following:

   - A minimal proof of concept that reliably demonstrates the vulnerability; or
   - A valid automated unit, request, integration, or other test that fails on the current `main` branch because of the vulnerability and demonstrates the security boundary violation.

   Proofs of concept should use synthetic data and should perform only the actions necessary to demonstrate the issue.

Reports consisting solely of automated scanner output, theoretical concerns, dependency-version findings, or unexpected behavior without a demonstrated security impact may not contain enough information for the project to validate them as security vulnerabilities.