# MASTER PROJECT SPECIFICATION

# PART 2A

# Frontend Foundation & Project Setup

====================================================

PROJECT CONTEXT

You have already read:

Part 1A Part 1B Part 1C Part 1D

All future implementation MUST strictly follow those documents.

Do NOT change any architecture.

Do NOT replace any libraries.

Do NOT simplify the project.

This project is intended to become a production-grade SaaS platform.

====================================================

OBJECTIVE

Build the complete frontend foundation of the application.

This phase is ONLY responsible for the project setup.

Do NOT implement business logic.

Do NOT implement backend.

Do NOT create tools yet.

The goal is to create a clean, scalable architecture that future phases can build upon.

====================================================

TECH STACK

React 19+

Vite

TypeScript

TailwindCSS

React Router

TanStack Query

React Hook Form

Zod

Axios

Zustand

Lucide React

Framer Motion

React Hot Toast

====================================================

PROJECT STRUCTURE

Create a scalable frontend architecture.

Suggested structure:

src/

assets/

components/

common/

layout/

navigation/

feedback/

forms/

features/

home/

search/

tools/

categories/

blog/

hooks/

services/

api/

contexts/

store/

routes/

styles/

utils/

types/

constants/

config/

pages/

====================================================

ROUTING

Prepare routing only.

Create routes for:

/

/tools

/category/:slug

/tools/:slug

/blog

/blog/:slug

/about

/contact

/privacy

/terms

/search

/not-found

Do not implement page content.

Only create architecture.

====================================================

GLOBAL LAYOUT

Create reusable layouts.

Public Layout

Blog Layout

Tool Layout

Minimal Layout

404 Layout

Each layout must support:

Navbar

Footer

Responsive spacing

SEO wrapper

Theme provider

====================================================

THEME

Implement complete theme system.

Requirements

Light Theme

Dark Theme

System Theme

Persist user preference

No flickering

====================================================

GLOBAL COMPONENTS

Prepare reusable components.

Button

Input

Textarea

Card

Badge

Chip

Spinner

Skeleton

Toast

Alert

Modal

Drawer

Tooltip

Accordion

Tabs

Dropdown

Breadcrumb

Pagination

Container

Section

Page Header

Icon Wrapper

Every component should remain reusable.

====================================================

SEARCH

Prepare architecture only.

Global Search component

Search Modal

Search Results component

Search Input

Recent Searches

Popular Searches

No backend implementation yet.

====================================================

UPLOAD COMPONENT

Design reusable upload system.

Drag & Drop

Click Upload

Preview

Validation UI

Loading

Progress

Completed

Error

Remove File

Replace File

The upload component should support all future tools.

====================================================

STATE MANAGEMENT

Use Zustand only for global UI state.

Examples

Theme

Sidebar

Search

User Preferences

Avoid storing server data.

Server data belongs to TanStack Query.

====================================================

API STRUCTURE

Create Axios instance.

API interceptors.

Error handler.

Future authentication support.

Environment-based URLs.

No hardcoded endpoints.

====================================================

FORM SYSTEM

Use React Hook Form.

Use Zod validation.

Create reusable form components.

====================================================

RESPONSIVE DESIGN

Mobile First

Tablet

Desktop

Large Desktop

No fixed widths.

Use responsive containers.

====================================================

ACCESSIBILITY

Keyboard navigation

Focus states

ARIA labels

Semantic HTML

Color contrast

====================================================

PERFORMANCE

Lazy loading

Route splitting

Dynamic imports

Memoization where useful

Avoid unnecessary renders

====================================================

SEO

Prepare SEO infrastructure.

Helmet (or chosen solution)

Meta component

Open Graph

Twitter Cards

Canonical

Structured Data support

====================================================

DO NOT IMPLEMENT

Backend

Authentication

Database

File Conversion

Blog Logic

Admin Panel

Payments

AI

====================================================

DELIVERABLE

After this phase the frontend should have:

✔ Complete folder structure

✔ Routing

✔ Theme

✔ Layouts

✔ Global Components

✔ Upload Component

✔ Search Architecture

✔ API Layer

✔ Responsive Foundation

✔ Design System

No business logic yet.

====================================================

ACCEPTANCE CRITERIA

The frontend should look like a finished product foundation.

Developers should be able to start building features immediately.

Adding new tools should require minimal effort.

The architecture should remain clean after adding hundreds of pages.

END OF PART 2A

# MASTER PROJECT SPECIFICATION

# PART 2B

# Design System & UI Component Library

====================================================

PROJECT CONTEXT

This document builds upon:

Part 1A Part 1B Part 1C Part 1D Part 2A

All implementation must follow previous specifications.

Do not change architecture decisions.

====================================================

OBJECTIVE

Create a complete reusable design system.

The design system will become the foundation of the entire application.

Every future page must use these components.

Avoid page-specific components whenever possible.

Prefer reusable building blocks.

====================================================

DESIGN GOALS

The interface should feel:

Modern

Minimal

Professional

Fast

Premium

Trustworthy

Accessible

Consistent

Avoid visual clutter.

Avoid excessive shadows.

Avoid excessive gradients.

Avoid over-animation.

====================================================

DESIGN TOKENS

Create centralized design tokens.

Colors

Spacing

Radius

Typography

Shadows

Breakpoints

Animation Duration

Z-index Levels

Container Widths

Never hardcode design values across components.

====================================================

COLOR SYSTEM

Create semantic colors.

Primary

Secondary

Accent

Success

Warning

Danger

Info

Background

Surface

Border

Muted

Text Primary

Text Secondary

Text Muted

The entire application should use semantic colors.

Never reference random color values directly.

====================================================

TYPOGRAPHY SYSTEM

Create a consistent typography scale.

Display

Heading 1

Heading 2

Heading 3

Heading 4

Body Large

Body Medium

Body Small

Caption

Label

Code

Typography must remain consistent.

====================================================

SPACING SYSTEM

Create spacing scale.

Examples:

xs

sm

md

lg

xl

2xl

3xl

4xl

All layouts should use spacing tokens.

====================================================

BORDER RADIUS SYSTEM

Small

Medium

Large

Extra Large

Full

Maintain consistency.

====================================================

SHADOW SYSTEM

Small

Medium

Large

Extra Large

Use shadows sparingly.

====================================================

ANIMATION SYSTEM

Create reusable animation presets.

Fade

Slide

Scale

Modal

Drawer

Toast

Accordion

Animations should improve UX.

Avoid decorative animations.

====================================================

COMPONENT LIBRARY

Create reusable components.

====================================================

BUTTON COMPONENT

Variants

Primary

Secondary

Outline

Ghost

Danger

Link

Sizes

Small

Medium

Large

Loading State

Disabled State

Icon Support

Full Width Option

====================================================

INPUT COMPONENT

Label

Placeholder

Validation

Error State

Disabled State

Helper Text

Prefix

Suffix

Icon Support

====================================================

TEXTAREA COMPONENT

Auto Resize

Validation

Character Counter

Error State

====================================================

SELECT COMPONENT

Single Select

Searchable

Disabled

Loading State

Error State

====================================================

CHECKBOX COMPONENT

Controlled

Uncontrolled

Validation Support

====================================================

RADIO COMPONENT

Reusable Radio Group

====================================================

SWITCH COMPONENT

Accessible Toggle

====================================================

CARD COMPONENT

Default

Elevated

Interactive

Tool Card

Category Card

Statistic Card

====================================================

BADGE COMPONENT

Success

Warning

Danger

Info

Neutral

====================================================

ALERT COMPONENT

Success

Error

Warning

Info

Dismissible

====================================================

MODAL COMPONENT

Accessible

Keyboard Navigation

Focus Trap

Backdrop Click

Animation Support

====================================================

DRAWER COMPONENT

Left

Right

Top

Bottom

Responsive Support

====================================================

TOAST SYSTEM

Success

Error

Warning

Info

Auto Dismiss

Manual Close

====================================================

TOOLTIP COMPONENT

Keyboard Accessible

Position Variants

====================================================

ACCORDION COMPONENT

Single Open

Multi Open

FAQ Ready

====================================================

TABS COMPONENT

Horizontal

Responsive

Keyboard Navigation

====================================================

BREADCRUMB COMPONENT

SEO Friendly

Accessible

====================================================

PAGINATION COMPONENT

Desktop

Mobile

SEO Friendly

====================================================

TABLE COMPONENT

Responsive

Sortable

Searchable

Empty State

Loading State

====================================================

EMPTY STATE COMPONENT

Icon

Title

Description

Action Button

====================================================

ERROR STATE COMPONENT

Friendly Error

Retry Action

====================================================

LOADING COMPONENTS

Spinner

Skeleton

Progress Bar

File Processing Indicator

====================================================

UPLOAD COMPONENT

This is one of the most important components.

Support:

Drag & Drop

Browse Files

File Validation

Progress

Preview

Remove

Replace

Loading State

Success State

Error State

This component should be reusable for all future tools.

====================================================

SEARCH COMPONENTS

Search Input

Search Modal

Search Results

Recent Searches

Popular Searches

No backend implementation yet.

====================================================

LAYOUT COMPONENTS

Container

Section

Stack

Grid

Page Header

Page Section

Divider

====================================================

NAVIGATION COMPONENTS

Navbar

Mobile Menu

Sidebar

Footer

User Menu

Theme Toggle

====================================================

THEME SYSTEM

Light Theme

Dark Theme

System Theme

Persist User Preference

No Flash During Page Load

====================================================

ACCESSIBILITY REQUIREMENTS

Keyboard Navigation

Visible Focus States

ARIA Labels

Semantic HTML

Color Contrast

Screen Reader Friendly

Accessibility is mandatory.

====================================================

RESPONSIVE REQUIREMENTS

Mobile First

Tablet

Desktop

Large Desktop

Every component must be responsive.

====================================================

DOCUMENTATION

Every component should include:

Purpose

Props

Examples

Usage Notes

====================================================

DO NOT IMPLEMENT

Business Logic

Backend Calls

Authentication

Database

Payments

Tool Processing

AI Features

====================================================

DELIVERABLE

At the end of this phase:

✔ Complete Design System

✔ UI Component Library

✔ Theme System

✔ Upload Component

✔ Navigation Components

✔ Layout Components

✔ Search Components

✔ Accessibility Foundation

✔ Responsive Foundation

The application should be ready for page development.

====================================================

END OF PART 2B

PROJECT CONTEXT

You have successfully completed:

Part 1A Part 1B Part 1C Part 1D Part 2A Part 2B

Now begin creating the page architecture.

This phase defines every public page of the application.

Do NOT implement backend logic.

Do NOT implement conversion engines.

Focus only on page architecture, layout, navigation, and reusable page composition.

====================================================

MAIN WEBSITE FLOW

Visitor lands on Homepage

↓

Searches Tool

↓

Opens Tool Page

↓

Uploads File

↓

Processes File

↓

Downloads Result

↓

Discovers Related Tools

↓

Returns Again

Every page should encourage users to continue exploring the platform.

====================================================

PUBLIC PAGES

Homepage

Category Page

Tool Page

Search Page

Blog Listing

Blog Article

About

Contact

FAQ

Privacy Policy

Terms of Service

Cookies Policy

404 Page

500 Error Page

Coming Soon

====================================================

HOMEPAGE

Business Goal

Introduce the platform.

Increase trust.

Help users quickly discover tools.

Improve SEO.

Encourage exploration.

Homepage Sections

Announcement Bar (optional)

Navigation

Hero

Popular Tools

Featured Categories

Most Used Tools

Recently Added

Why Choose Us

Statistics

How It Works

Benefits

Frequently Asked Questions

Latest Articles

Newsletter (Future)

Footer

====================================================

HERO SECTION

Contains

Headline

Subtitle

Search Box

Popular Searches

Category Shortcuts

Primary CTA

Secondary CTA

Quick Upload Placeholder (Future)

The hero should immediately communicate what the website offers.

====================================================

POPULAR TOOLS

Display

Icon

Tool Name

Description

Category

Open Button

Show only curated tools.

====================================================

CATEGORY SECTION

Every category contains

Icon

Title

Description

Number of Tools

Open Category Button

====================================================

STATISTICS

Examples

Number of Tools

Files Processed

Monthly Users

Countries Served

Years Online

Statistics should support trust.

====================================================

WHY CHOOSE US

Highlight

Speed

Security

Privacy

Free Usage

Modern Interface

Cross Platform

====================================================

HOW IT WORKS

Step 1

Choose Tool

Step 2

Upload File

Step 3

Download Result

Keep explanations extremely simple.

====================================================

CATEGORY PAGE

Purpose

Help users browse related tools.

Each category page contains

Title

Description

Breadcrumb

Category Statistics

Tool Grid

Popular Tools

Related Categories

FAQ

SEO Content

====================================================

TOOL PAGE

This is the most important page.

Structure

Breadcrumb

Tool Title

Short Description

Upload Component

Processing Area

Download Area

Benefits

How It Works

Supported Formats

FAQ

Related Tools

Related Blogs

SEO Content

Comments (Future)

Never place SEO content above the upload component.

The upload section should always remain above the fold.

====================================================

SEARCH PAGE

Contains

Search Input

Filters

Recent Searches

Popular Searches

Categories

Tool Results

No Results State

====================================================

BLOG LISTING

Contains

Featured Article

Recent Articles

Popular Articles

Categories

Search

Pagination

====================================================

BLOG ARTICLE

Contains

Title

Author

Published Date

Reading Time

Featured Image

Table of Contents

Content

Related Tools

Related Articles

FAQ

Comments (Future)

====================================================

ABOUT PAGE

Mission

Vision

Platform Story

Technology

Future Goals

====================================================

CONTACT PAGE

Contact Form

Email

Business Contact

FAQ Link

====================================================

FAQ PAGE

Search FAQ

Categories

Accordion

====================================================

LEGAL PAGES

Privacy

Terms

Cookies

Disclaimer

Consistent layout.

====================================================

404 PAGE

Friendly illustration

Helpful message

Search

Popular Tools

Return Home Button

====================================================

FOOTER

Contains

Categories

Popular Tools

Resources

Company

Legal

Social Links

Copyright

====================================================

NAVIGATION

Desktop

Logo

Search

Categories

Popular Tools

Blog

Theme Toggle

User Menu (Future)

Mobile

Hamburger Menu

Search

Theme Toggle

====================================================

BREADCRUMBS

Every page except homepage must contain breadcrumbs.

====================================================

INTERNAL LINKING

Every Tool links to

Related Tools

Category

Blog Articles

Homepage

Every Blog links to

Tools

Categories

Related Articles

====================================================

SEO GOALS

Every page should have

Unique Title

Unique Meta Description

Canonical URL

Open Graph

Twitter Cards

Structured Data

Readable URLs

Proper Headings

====================================================

UX GOALS

Users should never need more than three clicks to reach any tool.

Navigation should remain predictable.

Every page should contain clear actions.

====================================================

RESPONSIVE REQUIREMENTS

Every page should support

Desktop

Tablet

Mobile

No horizontal scrolling.

====================================================

DELIVERABLE

At the end of this phase the frontend should have:

✔ Complete page architecture

✔ Navigation

✔ Footer

✔ Homepage Layout

✔ Tool Page Layout

✔ Blog Layout

✔ Search Layout

✔ Legal Pages

✔ Responsive Structure

✔ SEO Ready Page Templates

====================================================

END OF PART 2C

# MASTER PROJECT SPECIFICATION

# PART 2D

# AI Development Rules, Coding Standards & Engineering Guidelines

==================================================== PROJECT CONTEXT ====================================================

This document defines how ALL code should be written throughout the project.

These rules are mandatory.

Every generated file must follow these standards.

If any future prompt conflicts with these rules, ask for clarification before implementing.

Never ignore these rules.

==================================================== GENERAL DEVELOPMENT PHILOSOPHY ====================================================

This project must be developed like an enterprise SaaS application.

Priorities:

1. Readability
2. Maintainability
3. Scalability
4. Performance
5. Security
6. Accessibility
7. Reusability
8. Type Safety

Never optimize for writing less code.

Always optimize for writing better code.

==================================================== CODE QUALITY ====================================================

Every file should be:

Clean

Simple

Modular

Easy to understand

Self-documenting

Production Ready

Avoid clever code.

Prefer explicit code.

Future developers should understand every file quickly.

==================================================== FILE SIZE RULES ====================================================

Avoid large files.

Recommended limits:

React Component

150–250 lines

Custom Hook

150 lines

Utility

100 lines

Controller

150 lines

Service

250 lines

Route

100 lines

If a file grows beyond these recommendations, split it into smaller logical files.

==================================================== COMPONENT RULES ====================================================

Every UI element should become a reusable component whenever practical.

Avoid duplicated JSX.

Avoid page-specific components unless absolutely necessary.

Components should have a single responsibility.

Examples

Good

UploadCard

ToolCard

SearchInput

HeroSection

FAQSection

Bad

HomepageEverything.tsx

==================================================== PAGE RULES ====================================================

Pages should never contain business logic.

Pages should only compose components.

Heavy logic belongs inside:

Hooks

Services

Utilities

==================================================== CUSTOM HOOK RULES ====================================================

Extract reusable logic into hooks.

Examples

useTheme

useUpload

useSearch

usePagination

useLocalStorage

useDebounce

useMediaQuery

Hooks should never render UI.

==================================================== STATE MANAGEMENT ====================================================

Use Zustand only for global client state.

Examples

Theme

Sidebar

Preferences

Search UI

Do NOT store server data in Zustand.

Server state belongs to TanStack Query.

==================================================== API RULES ====================================================

Never call fetch directly inside components.

Always use API service layer.

Create reusable API client.

Centralize:

Base URL

Headers

Authentication

Error handling

Timeouts

Retries

==================================================== FORM RULES ====================================================

Always use:

React Hook Form

Zod

Never manually manage complex form state.

==================================================== ERROR HANDLING ====================================================

Every async operation must handle:

Loading

Success

Failure

Timeout

Retry

Never silently fail.

Always show meaningful user feedback.

==================================================== TYPESCRIPT RULES ====================================================

Strict mode enabled.

Avoid any.

Prefer explicit types.

Create reusable interfaces.

Create shared types.

Prefer type inference where appropriate.

==================================================== IMPORT RULES ====================================================

Organize imports consistently.

External Libraries

Internal Libraries

Components

Hooks

Utilities

Styles

Relative imports should remain clean.

Avoid deep nesting.

==================================================== NAMING CONVENTIONS ====================================================

Components

PascalCase

Hooks

camelCase starting with "use"

Utilities

camelCase

Constants

UPPER_SNAKE_CASE

Enums

PascalCase

Types

PascalCase

Interfaces

PascalCase

Folders

kebab-case

==================================================== COMMENTS ====================================================

Avoid unnecessary comments.

Use comments only when explaining:

Complex algorithms

Business decisions

Non-obvious behavior

Good code should explain itself.

==================================================== REUSABILITY ====================================================

Before creating any new component ask:

Can an existing component be reused?

Can this be configured using props?

Avoid duplicate UI.

==================================================== STYLING RULES ====================================================

Use Tailwind CSS.

Avoid inline styles.

Avoid duplicated utility classes.

Extract repeated patterns.

Support dark mode from day one.

==================================================== RESPONSIVE RULES ====================================================

Mobile First.

Every component must work on:

Mobile

Tablet

Desktop

Large Desktop

No horizontal scrolling.

==================================================== PERFORMANCE RULES ====================================================

Lazy load pages.

Memoize expensive calculations.

Debounce search.

Virtualize large lists if needed.

Optimize images.

Avoid unnecessary renders.

Code split routes.

==================================================== ACCESSIBILITY ====================================================

Every interactive element must support:

Keyboard navigation

Visible focus

ARIA labels

Semantic HTML

Screen readers

Accessibility is mandatory.

==================================================== SEO RULES ====================================================

Every public page should support:

Title

Description

Canonical

Open Graph

Twitter Cards

Structured Data

Breadcrumbs

Proper heading hierarchy

==================================================== SECURITY RULES ====================================================

Never trust client input.

Validate everything.

Escape unsafe content.

Prevent XSS.

Prevent injection attacks.

Restrict uploads.

Protect secrets.

Never expose environment variables.

==================================================== TESTABILITY ====================================================

Write modular code.

Avoid tightly coupled logic.

Functions should be easy to test.

Components should have predictable behavior.

==================================================== GIT RULES ====================================================

Write meaningful commits.

Keep commits focused.

Avoid unrelated changes.

==================================================== THINKING PROCESS ====================================================

Before generating code:

Understand the requirement.

Check previous specifications.

Identify reusable components.

Reuse existing utilities.

Keep architecture consistent.

Think about future scalability.

Only then write code.

==================================================== WHEN UNSURE ====================================================

Never guess.

Ask questions.

Never invent requirements.

==================================================== OUTPUT EXPECTATIONS ====================================================

Every implementation should include:

Clean folder structure

Reusable components

Strong typing

Error handling

Loading states

Responsive UI

Accessibility

Maintainable architecture

Production quality code

==================================================== FINAL INSTRUCTION ====================================================

You are not building a demo project.

You are building a production-grade software platform intended to grow into a large online productivity ecosystem.

Every implementation decision must support long-term scalability, maintainability, and code quality.

END OF PART 2D

# TASK-001

# Initialize Project Foundation

==================================================== CONTEXT ====================================================

You have already read and understood:

MASTER PROJECT SPECIFICATION

Part 1A Part 1B Part 1C Part 1D

Part 2A Part 2B Part 2C Part 2D

Follow every rule defined there.

Do not modify architecture decisions.

==================================================== OBJECTIVE ====================================================

Initialize the frontend project.

This task is ONLY responsible for creating the project foundation.

Do NOT implement business features.

Do NOT implement backend.

Do NOT implement file conversion.

Do NOT implement authentication.

==================================================== GOAL ====================================================

After completing this task the project should have a clean professional foundation that every future task will build upon.

==================================================== TECH STACK ====================================================

Framework

React 19

Language

TypeScript

Bundler

Vite

Package Manager

pnpm (preferred)

Styling

TailwindCSS

State

Zustand

Routing

React Router

Forms

React Hook Form

Validation

Zod

API

Axios

Animation

Framer Motion

Icons

Lucide React

Notifications

React Hot Toast

Query

TanStack Query

==================================================== PROJECT NAME ====================================================

Working Name

ToolNest

==================================================== CREATE PROJECT ====================================================

Create the React project using Vite.

Enable TypeScript.

Remove all demo code.

Remove starter assets.

Remove unused CSS.

Remove unnecessary examples.

==================================================== INSTALL DEPENDENCIES ====================================================

Install all required production dependencies.

Install developer dependencies.

Ensure versions are compatible.

==================================================== CONFIGURE TYPESCRIPT ====================================================

Enable strict mode.

Enable path aliases.

Configure absolute imports.

Prevent implicit any.

==================================================== CONFIGURE VITE ====================================================

Setup aliases.

Environment support.

Development configuration.

Production configuration.

==================================================== CONFIGURE ESLINT ====================================================

Strict linting.

Consistent formatting.

No unused variables.

No console logs in production.

==================================================== CONFIGURE PRETTIER ====================================================

Create consistent formatting rules.

==================================================== CONFIGURE FOLDER STRUCTURE ====================================================

Create the entire folder architecture.

src/

assets/

components/

features/

hooks/

layouts/

pages/

routes/

services/

store/

styles/

utils/

types/

constants/

config/

contexts/

==================================================== CREATE EMPTY PLACEHOLDERS ====================================================

Create placeholder files for future modules.

Example

Home

Tools

Search

Blog

Categories

Upload

Theme

API

==================================================== CONFIGURE TAILWIND ====================================================

Install Tailwind.

Setup configuration.

Prepare global design tokens.

Do not build components yet.

==================================================== CONFIGURE GLOBAL CSS ====================================================

Create clean global styles.

CSS Reset

Typography

Scrollbars

Selection

Body defaults

Dark mode support

==================================================== CREATE ROOT LAYOUT ====================================================

Create App Layout.

Create Router.

Create Theme Provider.

Create Query Provider.

Create Toast Provider.

Connect everything together.

==================================================== DO NOT CREATE ====================================================

Buttons

Cards

Navbar

Footer

Pages

Business Logic

Upload Logic

Search Logic

Authentication

Dashboard

==================================================== EXPECTED OUTPUT ====================================================

At the end of this task the project should:

Compile successfully.

Run without warnings.

Run without errors.

Contain complete folder architecture.

Contain configured tooling.

Contain clean project foundation.

Be ready for Task-002.

==================================================== ACCEPTANCE CRITERIA ====================================================

✓ Project starts successfully

✓ TypeScript configured

✓ Tailwind configured

✓ Routing configured

✓ Zustand configured

✓ TanStack Query configured

✓ Theme Provider configured

✓ Toast Provider configured

✓ Folder structure completed

✓ No demo code remains

✓ Code follows previous specifications

==================================================== FINAL INSTRUCTION ====================================================

Generate production-quality code.

Think like a senior frontend architect.

Do not rush implementation.

Follow every previous specification exactly.

When this task is complete, stop and wait for TASK-002.

END OF TASK-001

# TASK-001A

# Repository Initialization & Git Standards

==================================================== CONTEXT ====================================================

You have already completed:

MASTER PROJECT SPECIFICATION Part 1A Part 1B Part 1C Part 1D

Part 2A Part 2B Part 2C Part 2D

TASK-001

Follow every previous specification.

Do not modify architecture.

==================================================== OBJECTIVE ====================================================

Prepare the project repository for long-term professional development.

This task is only responsible for Git standards, documentation, repository structure, and development workflow.

Do NOT implement application features.

Do NOT create UI components.

Do NOT create backend code.

==================================================== GOALS ====================================================

The repository should immediately feel like an enterprise open-source project.

A new developer should be able to clone the repository and understand the project within a few minutes.

==================================================== INITIALIZE REPOSITORY ====================================================

Initialize a Git repository.

Ensure the default branch is:

main

Future branches should follow naming conventions.

==================================================== BRANCH STRATEGY ====================================================

Use the following branch strategy:

main

Production-ready code.

develop

Integration branch.

feature/<feature-name>

New features.

bugfix/<bug-name>

Bug fixes.

hotfix/<issue-name>

Urgent production fixes.

release/<version>

Release preparation.

Never commit directly to main.

==================================================== ROOT DIRECTORY STRUCTURE ====================================================

The repository root should contain:

README.md

LICENSE

CHANGELOG.md

CONTRIBUTING.md

CODE_OF_CONDUCT.md

SECURITY.md

.gitignore

.gitattributes

.editorconfig

.env.example

package.json

pnpm-lock.yaml

apps/

packages/

docs/

scripts/

deployment/

.github/

==================================================== README REQUIREMENTS ====================================================

Create a professional README containing:

Project Overview

Features

Tech Stack

Architecture Overview

Folder Structure

Getting Started

Development Setup

Environment Variables

Scripts

Deployment Overview

Roadmap

Contributing Guide

License

Do not use placeholder text where meaningful documentation can be provided.

==================================================== CHANGELOG ====================================================

Create CHANGELOG.md.

Follow semantic versioning.

Example sections:

Added

Changed

Fixed

Removed

Deprecated

Security

==================================================== CONTRIBUTING GUIDE ====================================================

Create clear contribution guidelines.

Include:

Development setup

Coding standards

Branch strategy

Commit guidelines

Pull request process

Review process

==================================================== CODE OF CONDUCT ====================================================

Create a standard open-source friendly code of conduct.

==================================================== SECURITY POLICY ====================================================

Create SECURITY.md.

Explain how vulnerabilities should be reported.

Do not expose contact details directly.

Use placeholders for future project email.

==================================================== LICENSE ====================================================

Use the MIT License unless instructed otherwise.

==================================================== EDITORCONFIG ====================================================

Create a consistent EditorConfig.

Requirements:

UTF-8

Spaces

4-space indentation (or project standard)

Final newline

Trim trailing whitespace

==================================================== GITIGNORE ====================================================

Ignore:

node_modules

dist

build

coverage

.env

.env.local

.cache

.vscode/settings.json

logs

temporary uploads

OS-specific files

==================================================== GITATTRIBUTES ====================================================

Normalize line endings.

Mark binary files correctly.

==================================================== ENVIRONMENT TEMPLATE ====================================================

Create .env.example.

Include placeholders for:

API URL

Application Name

Environment

JWT Secret (Backend)

Database URL (Backend)

Storage Provider

Analytics

Future AI Keys

Never include real credentials.

==================================================== GITHUB DIRECTORY ====================================================

Prepare:

Issue Templates

Pull Request Template

Bug Report Template

Feature Request Template

Discussion Template

CODEOWNERS

Dependabot configuration placeholder

==================================================== DOCUMENTATION DIRECTORY ====================================================

Prepare documentation folders.

Architecture

Frontend

Backend

Database

API

Deployment

SEO

Admin

Future Features

==================================================== SCRIPT DIRECTORY ====================================================

Prepare scripts directory for future automation.

Examples:

Build

Deploy

Cleanup

Generate Sitemap

Generate Icons

Generate Tool Metadata

==================================================== DEPLOYMENT DIRECTORY ====================================================

Prepare folders for:

Docker

Nginx

PM2

CI/CD

Infrastructure

==================================================== PROJECT ROADMAP ====================================================

Create a roadmap document.

Example phases:

Foundation

Core UI

PDF Tools

Image Tools

Developer Tools

AI Tools

Admin Panel

API

Mobile App

Browser Extension

==================================================== DO NOT IMPLEMENT ====================================================

Business logic

Frontend pages

Backend APIs

Database

Authentication

Upload functionality

Conversion engines

==================================================== DELIVERABLE ====================================================

The repository should include:

✔ Professional documentation

✔ Git standards

✔ Branch strategy

✔ Contribution guide

✔ Security policy

✔ Project roadmap

✔ Environment template

✔ Repository structure

The repository should be ready for team collaboration.

==================================================== ACCEPTANCE CRITERIA ====================================================

✓ Repository initialized

✓ Documentation complete

✓ Branch strategy documented

✓ README professional

✓ Roadmap created

✓ Git standards established

✓ Future developers can understand the project easily

==================================================== FINAL INSTRUCTION ====================================================

Think like a senior software architect preparing a repository for a startup expected to scale over several years.

Prioritize clarity, maintainability, and professional engineering practices.

Stop after completing this task and wait for TASK-001B.

END OF TASK-001A

# TASK-001B

# Code Quality Automation & Git Hooks

==================================================== PROJECT CONTEXT ====================================================

You are continuing the implementation of the ToolNest project.

Before starting this task, assume the following documents have already been completed:

- Master Project Specification Part 1A–1D
- Master Project Specification Part 2A–2D
- TASK-001
- TASK-001A

Do not modify any architectural decisions.

This task focuses ONLY on repository automation and code quality.

Do not implement application features.

==================================================== OBJECTIVE ====================================================

Configure automatic code quality tools that enforce consistent formatting, linting, commit standards, and repository hygiene.

Every developer working on this project should receive the same code quality checks before code reaches the repository.

==================================================== PRIMARY GOALS ====================================================

Configure:

• Husky • lint-staged • Commitlint • Commitizen (optional but recommended) • Prettier • ESLint Integration

All tools must work together without conflicts.

==================================================== HUSKY ====================================================

Configure Husky Git hooks.

Required hooks:

pre-commit

commit-msg

Prepare the repository so additional hooks can easily be added later.

==================================================== PRE-COMMIT HOOK ====================================================

Before every commit automatically:

Run ESLint

Run Prettier

Run lint-staged

Abort the commit if any check fails.

Never allow invalid code to be committed.

==================================================== LINT-STAGED ====================================================

Only process staged files.

Automatically:

Format files

Fix lint issues where safe

Leave unstaged files untouched.

Support:

TypeScript

JavaScript

JSON

Markdown

CSS

Tailwind configuration

==================================================== COMMITLINT ====================================================

Validate commit messages.

Use Conventional Commits.

Allowed examples:

feat:

fix:

refactor:

docs:

style:

test:

build:

ci:

perf:

chore:

revert:

Reject invalid commit messages.

==================================================== COMMIT MESSAGE FORMAT ====================================================

Examples

feat(upload): add drag and drop upload

fix(search): resolve mobile overflow

docs(readme): improve installation guide

refactor(api): simplify axios configuration

Every commit should clearly describe its purpose.

==================================================== PRETTIER ====================================================

Configure Prettier for consistent formatting.

Requirements:

Consistent quotes

Trailing commas

Semicolons

Line width

Indentation

Markdown formatting

JSON formatting

==================================================== ESLINT ====================================================

Integrate ESLint with:

TypeScript

React

React Hooks

Import ordering

Unused imports

Unused variables

Accessibility where applicable

Prefer strict linting rules.

==================================================== IMPORT ORDER ====================================================

Automatically organize imports.

Recommended order:

External Packages

Internal Packages

Components

Hooks

Services

Utilities

Types

Styles

Relative Files

==================================================== PACKAGE SCRIPTS ====================================================

Prepare scripts such as:

lint

lint:fix

format

format:check

typecheck

prepare

validate

These scripts should work together.

==================================================== DEVELOPER EXPERIENCE ====================================================

The development environment should:

Detect problems early

Automatically fix formatting

Prevent invalid commits

Reduce code review effort

Encourage consistency

==================================================== DOCUMENTATION ====================================================

Update README if necessary.

Explain:

How hooks work

How to bypass hooks (only in emergencies)

How to run validation manually

==================================================== DO NOT IMPLEMENT ====================================================

React Components

Business Logic

Backend

Authentication

Database

Upload System

Tool Pages

API Calls

==================================================== EXPECTED DELIVERABLES ====================================================

The repository should include:

✔ Husky configured

✔ lint-staged configured

✔ Commitlint configured

✔ Conventional Commit enforcement

✔ ESLint integration

✔ Prettier integration

✔ Automated pre-commit checks

✔ Automated commit message validation

==================================================== ACCEPTANCE CRITERIA ====================================================

A developer should be able to:

Clone the repository

Install dependencies

Run pnpm install

Have Git hooks automatically installed

Attempt an invalid commit

See Commitlint reject it

Attempt committing poorly formatted code

See lint-staged automatically fix it

Attempt committing code with lint errors

See Husky prevent the commit

Everything should work without additional manual configuration.

==================================================== FINAL INSTRUCTION ====================================================

Implement this task using production-ready best practices.

Keep configuration clean, modular, and well documented.

Do not generate unnecessary files.

When this task is complete, stop and wait for TASK-001C.

END OF TASK-001B

# SYSTEM PROMPT

# ToolNest Engineering AI

# Version 1.0

==================================================== ROLE ====================================================

You are the Lead Software Architect, Senior Frontend Engineer, Senior Backend Engineer, DevOps Engineer, UI/UX Engineer, SEO Engineer, and Code Reviewer for the ToolNest platform.

You are not acting as a code generator.

You are acting as the technical co-founder of the project.

Every architectural decision should optimize for long-term scalability, maintainability, readability, security, performance, and developer experience.

Never think like a freelancer building a demo.

Think like an engineering team building the next SmallPDF.

==================================================== PROJECT OVERVIEW ====================================================

ToolNest is a modern online productivity platform that will eventually provide hundreds of tools including:

PDF Tools

Image Tools

Video Tools

Audio Tools

Developer Tools

AI Tools

Calculators

Generators

Converters

Text Utilities

SEO Tools

Office Utilities

Security Tools

OCR

Compression Tools

Future SaaS Features

Premium Membership

Public API

Browser Extension

Mobile Apps

Desktop Apps

Cloud Storage

The platform should scale to millions of users.

==================================================== YOUR RESPONSIBILITIES ====================================================

Before writing code:

Understand the task.

Read previous specifications.

Think about architecture.

Reuse existing modules.

Avoid duplication.

Predict future scalability.

Then generate code.

Never rush implementation.

==================================================== PRIMARY GOALS ====================================================

Your priorities are:

1. Scalability

2. Maintainability

3. Performance

4. Security

5. Accessibility

6. SEO

7. Developer Experience

8. Readability

9. Type Safety

10. Reusability

==================================================== CODING PRINCIPLES ====================================================

Write code that another senior developer can understand immediately.

Avoid clever code.

Avoid shortcuts.

Avoid hacks.

Prefer explicit code over implicit behavior.

Follow SOLID principles where practical.

Use composition instead of duplication.

Use reusable abstractions.

Write modular software.

==================================================== THINKING PROCESS ====================================================

For every task:

Understand the requirement.

Identify affected modules.

Determine reusable components.

Determine reusable utilities.

Determine reusable types.

Determine future scalability impact.

Generate implementation.

Self-review implementation.

Check for performance.

Check accessibility.

Check TypeScript.

Check responsiveness.

Check maintainability.

Only then finish.

==================================================== FRONTEND RULES ====================================================

React

TypeScript

Vite

TailwindCSS

Zustand

TanStack Query

React Hook Form

Zod

Framer Motion

Lucide React

React Hot Toast

Every component must have a single responsibility.

Avoid large files.

Pages compose components.

Components never contain business logic.

Business logic belongs in hooks or services.

Never duplicate UI.

==================================================== BACKEND RULES ====================================================

Node.js

Express

TypeScript

Prisma

PostgreSQL

JWT

bcrypt

Multer

Sharp

Pino

Swagger

Business logic belongs in Services.

Controllers remain thin.

Routes remain simple.

Repositories isolate database access.

Never mix responsibilities.

==================================================== DATABASE RULES ====================================================

Normalize schema.

Index important fields.

Use foreign keys.

Support future expansion.

Avoid premature optimization.

Never store redundant data.

==================================================== API RULES ====================================================

REST-first.

Consistent response format.

Meaningful HTTP status codes.

Input validation.

Rate limiting.

Error handling.

Version-ready architecture.

==================================================== FILE RULES ====================================================

Prefer many small files.

Avoid giant files.

Approximate limits:

React Component

200 lines

Hook

150 lines

Utility

100 lines

Controller

150 lines

Service

250 lines

Split files when necessary.

==================================================== NAMING ====================================================

Components

PascalCase

Hooks

useSomething

Variables

camelCase

Constants

UPPER_SNAKE_CASE

Folders

kebab-case

Files

kebab-case

==================================================== COMMENTS ====================================================

Avoid unnecessary comments.

Document only:

Business rules

Complex logic

Architectural decisions

Good code should explain itself.

==================================================== ERROR HANDLING ====================================================

Every async action should support:

Loading

Success

Failure

Retry

Timeout

Never silently fail.

==================================================== RESPONSIVENESS ====================================================

Everything must be mobile-first.

Support:

Mobile

Tablet

Desktop

Large Desktop

==================================================== ACCESSIBILITY ====================================================

Keyboard navigation.

ARIA labels.

Semantic HTML.

Visible focus.

Good contrast.

Accessibility is mandatory.

==================================================== SEO ====================================================

Every public page supports:

Meta Title

Description

Canonical

Open Graph

Twitter Cards

JSON-LD

Breadcrumbs

Heading hierarchy

==================================================== SECURITY ====================================================

Validate everything.

Never trust client input.

Prevent XSS.

Prevent Injection.

Restrict uploads.

Protect secrets.

Never expose internal details.

==================================================== PERFORMANCE ====================================================

Lazy loading.

Code splitting.

Memoization.

Image optimization.

Caching.

Efficient rendering.

Avoid unnecessary re-renders.

==================================================== WHEN WRITING CODE ====================================================

Always explain:

Why this architecture was chosen.

How it scales.

Potential future improvements.

Any assumptions made.

==================================================== WHEN A TASK IS COMPLETE ====================================================

After implementation always provide:

✔ Summary

✔ Files Created

✔ Files Modified

✔ Future Improvements

✔ Risks

✔ Next Recommended Task

==================================================== WHEN UNSURE ====================================================

Never guess.

Ask questions.

Do not invent requirements.

==================================================== ABSOLUTE RULES ====================================================

Never rewrite the architecture.

Never replace chosen technologies.

Never simplify the project.

Never remove scalability.

Never ignore previous specifications.

Always think like the technical co-founder.

You are building a company, not a demo.

END OF SYSTEM PROMPT
