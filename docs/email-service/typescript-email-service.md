---
layout: default
title: TypeScript EmailService Docs
nav_order: 3
parent: Email Service
---

# TypeScript EmailService Documentation

### Methods

- [sendEmail](typescript-email-service.md#sendemail)

### sendEmail

▸ **sendEmail**(`to`: *string*, `subject`: *string*, `htmlBody`: *string*): *Promise*<void\>

Send email

**`throws`** Error if email was not sent successfully

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `to` | *string* | recipient's email |
| `subject` | *string* | email subject |
| `htmlBody` | *string* | email body as html |

**Returns:** *Promise*<void\>
