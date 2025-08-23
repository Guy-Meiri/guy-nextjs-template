# LLM Instructions for Next.js Golden Template Development

## 🎯 Project Overview

This is a comprehensive Next.js golden template repository designed to eliminate repetitive setup work for full-stack progressive web applications. The template includes a modern tech stack with TypeScript, Tailwind CSS, Shadcn/ui, Supabase, NextAuth.js, TanStack Query, and more.

## 📋 Working Guidelines

### 1. **Always Reference the README.md**
- The `README.md` contains the complete project vision, tech stack, and features
- Use it as the authoritative source for:
  - Technology choices and versions
  - Project structure decisions
  - Feature requirements
  - Setup instructions
  - Environment configuration

### 2. **Maintain PROGRESS.md Throughout Development**
- **CRITICAL**: Always update `PROGRESS.md` after completing any task
- Mark completed items with `[x]` instead of `[ ]`
- Update phase completion counts (e.g., "Phase 1: Core Setup (3/6 completed)")
- Update overall progress percentage
- Record actual time spent in the time tracking table
- Add notes about any challenges or decisions made
- Update "Recent Changes" section with what was accomplished
- Move to next actions as phases progress

### 3. **Phase-Based Development Approach**
Follow the 9 phases outlined in PROGRESS.md:
1. **Core Setup** - Project initialization and basic tooling
2. **UI Foundation** - Styling and component setup
3. **Authentication** - NextAuth.js and Supabase Auth
4. **Database Integration** - Supabase client and schema
5. **Data Management** - TanStack Query, Zod validation
6. **PWA Setup** - Progressive web app features
7. **Example Implementation** - Demo features and pages
8. **Developer Experience** - Testing, docs, tooling
9. **Production Ready** - Performance, security, polish

### 4. **Code Quality Standards**
- Use TypeScript throughout with strict type checking
- Follow Next.js 14+ App Router patterns
- Implement proper error handling and loading states
- Ensure components are accessible and responsive
- Follow naming conventions and folder structure from README.md

### 5. **Documentation Updates**
When adding new features or making changes:
- Update relevant sections in README.md if needed
- Document any new environment variables
- Update setup checklists
- Add examples to the quick start guide

### 6. **Template Usability**
Always consider that this template will be used by others:
- Include clear comments in complex code
- Provide example usage patterns
- Make configuration obvious and well-documented
- Ensure the template works out-of-the-box after setup

## 🔄 Workflow Process

### Before Starting Work:
1. Review the current phase in PROGRESS.md
2. Check README.md for context and requirements
3. Understand the specific task objectives

### During Development:
1. Follow the tech stack specifications from README.md
2. Maintain code quality and consistency
3. Test that features work as expected
4. Consider template reusability

### After Completing Tasks:
1. **MANDATORY**: Update PROGRESS.md with completed items
2. Update progress percentages and completion counts
3. Record actual time spent
4. Note any important decisions or changes made
5. Update README.md if new features affect setup or usage

## 📁 Key Files to Maintain

- `README.md` - Project documentation and setup guide
- `PROGRESS.md` - Development tracking and phase completion
- `package.json` - Dependencies and scripts
- `.env.example` - Environment variable template
- Project structure as defined in README.md

## 🎯 Success Criteria

The template is successful when:
- All 9 phases are completed with features working
- New projects can be created using the npx command
- Setup process is straightforward with clear documentation
- All major features (auth, database, UI, PWA) work out-of-the-box
- Code is production-ready and follows best practices

---

**Remember**: This template will be used by developers to quickly bootstrap new projects. Every decision should prioritize ease of use, clarity, and production readiness.
