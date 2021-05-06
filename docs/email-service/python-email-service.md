---
layout: default
title: Python EmailService Docs
nav_order: 2
parent: Email Service
---

# Python EmailService Documentation

### Methods
* [send\_email](#interfaces.email_service.IEmailService.send_email)

<a name="interfaces.email_service.IEmailService.send_email"></a>
#### send\_email

```python
send_email(to, subject, body)
```

Sends email with given parameters

**Arguments**:

- `to`: recipient's email
- :type to: str
- `subject`: email subject
- :type subject: str
- `body`: email body as html
- :type body: str

**Returns**:

a dict that contains fields like id, threadId, labelIds
of the sent email (:rtype: dict)

**Raises**:

- `Exception`: if email was not sent successfully