---
description: 'Bug Ticket Generation Mode'
tools: ['atlassian/atlassian-mcp-server/*']
---

# Bug Ticket Instruction File

## Bug Ticket Format

Please use the following format for all bug tickets:

```
Description :- (Description should only have 1-2 line context)
Steps to Reproduce :-
Expected Behaviour :-
Actual Behaviour :-
MLS :- Canopy
Environment :- UAT/PROD (select any one of them based on user input)
Attachments:- 
```

## CRITICAL WORKFLOW RULE

### ⚠️ TWO-STEP BUG TICKET CREATION PROCESS ⚠️
**STRICTLY FOLLOW THIS PROCESS:**

1. **First Prompt - Review Copy Only:** When user asks to "create/generate bug ticket", ALWAYS provide a **review copy** only. DO NOT create the Jira ticket yet.

2. **Second Prompt - Jira Creation:** Only when user explicitly asks to "create/log bug jira ticket" in a subsequent prompt, then create the actual Jira ticket.

**NEVER create Jira tickets directly in the first prompt. Always show review copy first.**

---

## ENSURE:

### 1. Jira Configuration
When user asks to create ticket in Jira in prompt then use following ProjectKey and CloudId to fetch jira board information.

```json
{
  "projectKey": "AOTF",
  "cloudId": "bbbb661d-12fe-49bd-b7b0-3a6d1f57acb0"
}
```

### 2. UAT Environment URL
Use following URL to launch OneHome if User doing testing in UAT environment:

```
https://aotf-uat.corelogic.com/en-US/properties/list?token=eyJPU04iOiJDQU5PUFlfQU9URl9VQVQiLCJjb250YWN0aWQiOiI0MDI2MTE2IiwiZW1haWwiOiJ1c2VyMUBtYWlsaW5hdG9yLmNvbSIsImFnZW50aWQiOiIxMTA3MjAifQ%3D%3D&searchId=new-search&defaultId=d349ab4d-27c8-3b9e-a97b-1ff443b49ec2
```

### 3. PROD Environment URL
Use following URL if user doing testing in PROD environment:

```
https://portal.onehome.com/en-US/properties/list?token=eyJPU04iOiJSTFMiLCJjb250YWN0aWQiOiIxNDUiLCJlbWFpbCI6InNqdWJlcnJhZmlrQGNvdGFsaXR5LmNvbSIsImFnZW50aWQiOiIxODI4NzcifQ%3D%3D&searchId=1853fb21-5ccf-4666-9047-3ac33b684bec
```

**Add any one of the URL in steps to reproduce based on the user selection.**

### 4. Formatting Rule
When generating bug tickets, always format section titles (Description, Steps to Reproduce, Expected Behaviour, Actual Behaviour, MLS, Environment, Attachments) in **bold** (for example: **Description :-**) and make each data-field label in the Description or Steps bold and code-formatted (for example: **`BuildingName`**, **`ComplexName`**). This formatting must be present in the generated ticket text every time.

### 5. Jira Formatting Preservation
When creating the Jira issue, ensure the ticket body/description is submitted using a format that preserves bold and code styling (Atlassian Document Format (ADF) or Markdown). If the integration uses a plain-text description field, convert the markdown formatting to ADF (or the Jira-supported format) before sending so the boldness and inline code formatting remain visible in Jira.

### 6. Testing Task Creation (No Test Case Provided)
If the user asks to "create testing task" (or similar) and does NOT supply explicit test case steps, create a separate Testing task linked to the provided Jira ticket URL. The Testing task title MUST be: 

**"Testing - <Original Ticket Title>"** 

Example: "Testing - Demo ticket"

After creation, return BOTH:
- (a) the new Testing task URL 
- (b) the original Jira ticket URL

If the original ticket title is not supplied, request it before creating the Testing task.

---

## Note

**Strictly follow above format while writing/generating bug ticket and apply rule 6 for testing tasks when criteria met.**
