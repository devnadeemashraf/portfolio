import { config, fields, collection, singleton } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

// Local files in development. Set NEXT_PUBLIC_KEYSTATIC_STORAGE=github in Vercel to edit via GitHub.
const useGithub = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === 'github';

/** Custom MDX blocks shared by projects and build logs. */
const components = {
  Decision: block({
    label: 'Decision',
    schema: {
      chose: fields.text({ label: 'Chose', multiline: true }),
      because: fields.text({ label: 'Because', multiline: true }),
      tradeoff: fields.text({ label: 'Trade-off', multiline: true }),
    },
  }),
  Code: block({
    label: 'Code',
    schema: {
      filename: fields.text({ label: 'File name (optional)' }),
      code: fields.text({ label: 'Code', multiline: true }),
    },
  }),
  Figure: block({
    label: 'Figure',
    schema: {
      src: fields.image({
        label: 'Image',
        directory: 'public/figures',
        publicPath: '/figures/',
      }),
      alt: fields.text({ label: 'Alt text' }),
      caption: fields.text({ label: 'Caption' }),
    },
  }),
  Metrics: block({
    label: 'Metrics',
    schema: {
      items: fields.array(
        fields.object({
          value: fields.text({ label: 'Value (e.g. 0 oversells)' }),
          label: fields.text({ label: 'What it measures', multiline: true }),
        }),
        { label: 'Metrics', itemLabel: (p) => p.fields.value.value },
      ),
    },
  }),
  Flow: block({
    label: 'Flow diagram',
    schema: {
      caption: fields.text({ label: 'Caption' }),
      nodes: fields.array(
        fields.object({
          title: fields.text({ label: 'Title' }),
          note: fields.text({ label: 'Note (mono, short)' }),
          highlight: fields.checkbox({ label: 'Highlight' }),
        }),
        { label: 'Nodes (left to right, top to bottom)', itemLabel: (p) => p.fields.title.value },
      ),
    },
  }),
};

export default config({
  storage: useGithub
    ? { kind: 'github', repo: 'devnadeemashraf/portfolio' }
    : { kind: 'local' },

  ui: { brand: { name: 'nadeemashraf.cyou' } },

  singletons: {
    profile: singleton({
      label: 'Profile',
      path: 'content/profile',
      schema: {
        name: fields.text({ label: 'Name' }),
        monogram: fields.text({ label: 'Monogram (2 letters)' }),
        role: fields.text({ label: 'Role (static: SEO, OG, JSON-LD)' }),
        roles: fields.array(
          fields.object({
            word: fields.text({ label: 'Headline word (e.g. Full-stack)' }),
            title: fields.text({ label: 'Title line (e.g. Senior Full-Stack Engineer)' }),
            headline: fields.text({ label: 'Headline (bright part) for this role', multiline: true }),
            dim: fields.text({ label: 'Headline (dim tail) for this role', multiline: true }),
          }),
          { label: 'Rotating roles (hero flip)', itemLabel: (p) => p.fields.word.value },
        ),
        city: fields.text({ label: 'City' }),
        heroHeadline: fields.text({ label: 'Hero headline (bright part)', multiline: true }),
        heroHeadlineDim: fields.text({ label: 'Hero headline (dim tail)', multiline: true }),
        lead: fields.text({ label: 'Lead paragraph', multiline: true }),
        available: fields.checkbox({
          label: 'Open to roles',
          description: 'Off hides the availability pill, recruiter card, pulse and relocation chip everywhere.',
          defaultValue: true,
        }),
        availableLabel: fields.text({ label: 'Availability label' }),
        openTo: fields.array(
          fields.object({
            label: fields.text({ label: 'Chip' }),
            info: fields.text({ label: 'Tooltip', multiline: true }),
          }),
          { label: 'Open to (chips with tooltips)', itemLabel: (p) => p.fields.label.value },
        ),
        relocation: fields.array(fields.text({ label: 'Country' }), {
          label: 'Open to relocate to (abroad)',
          itemLabel: (p) => p.value,
        }),
        startDate: fields.text({ label: 'Start date' }),
        email: fields.text({ label: 'Public email' }),
        siteUrl: fields.text({ label: 'Site URL', defaultValue: 'https://nadeemashraf.cyou' }),
        resumeSde: fields.text({ label: 'Résumé (software) path', defaultValue: '/resume/Nadeem_Ashraf_SDE_Master.pdf' }),
        resumeFde: fields.text({ label: 'Résumé (forward deployed) path', defaultValue: '/resume/Nadeem_Ashraf_FDE_Master.pdf' }),
        bookingLinks: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            minutes: fields.integer({ label: 'Minutes' }),
            summary: fields.text({ label: 'What it is', multiline: true }),
            idealFor: fields.text({ label: 'Ideal for', multiline: true }),
            url: fields.text({ label: 'Cal.com URL' }),
            primary: fields.checkbox({ label: 'Primary CTA' }),
          }),
          { label: 'Booking links', itemLabel: (p) => `${p.fields.title.value} · ${p.fields.minutes.value}m` },
        ),
      },
    }),

    recruiter: singleton({
      label: 'Recruiter summary',
      path: 'content/recruiter',
      schema: {
        title: fields.text({ label: 'Sheet title' }),
        lookingFor: fields.array(fields.text({ label: 'Role' }), { label: 'Looking for', itemLabel: (p) => p.value }),
        experience: fields.text({ label: 'Experience' }),
        coreStack: fields.array(fields.text({ label: 'Tool' }), { label: 'Core stack', itemLabel: (p) => p.value }),
        noticePeriod: fields.text({ label: 'Notice period' }),
        workPreference: fields.text({ label: 'Work preference' }),
        relocationNote: fields.text({ label: 'Relocation' }),
        qualities: fields.array(
          fields.object({ title: fields.text({ label: 'Quality' }), text: fields.text({ label: 'Evidence', multiline: true }) }),
          { label: 'Top selling qualities (do not repeat the résumé)', itemLabel: (p) => p.fields.title.value },
        ),
        visaNote: fields.text({ label: 'Visa' }),
        highlights: fields.array(fields.text({ label: 'Highlight', multiline: true }), {
          label: 'Highlights (numbers I can back up)',
          itemLabel: (p) => p.value,
        }),
      },
    }),

    home: singleton({
      label: 'Home statements',
      path: 'content/home',
      schema: {
        work: fields.object({
          label: fields.text({ label: 'Chapter label' }),
          statement: fields.text({ label: 'Statement', multiline: true }),
          cta: fields.text({ label: 'Link text' }),
        }, { label: 'Work' }),
        logs: fields.object({
          label: fields.text({ label: 'Chapter label' }),
          statement: fields.text({ label: 'Statement', multiline: true }),
          cta: fields.text({ label: 'Link text' }),
        }, { label: 'Build logs' }),
        projects: fields.object({
          label: fields.text({ label: 'Chapter label' }),
          statement: fields.text({ label: 'Statement', multiline: true }),
          cta: fields.text({ label: 'Link text' }),
        }, { label: 'Projects' }),
        about: fields.object({
          label: fields.text({ label: 'Chapter label' }),
          statement: fields.text({ label: 'Statement', multiline: true }),
          cta: fields.text({ label: 'Link text' }),
        }, { label: 'About' }),
        contactLabel: fields.text({ label: 'Contact label' }),
        contactHeadline: fields.text({ label: 'Contact headline', multiline: true }),
        contactLead: fields.text({ label: 'Contact lead', multiline: true }),
        closingHeadline: fields.text({ label: 'Closing CTA headline (inner pages)', multiline: true }),
        closingLead: fields.text({ label: 'Closing CTA lead', multiline: true }),
      },
    }),

    socials: singleton({
      label: 'Socials',
      path: 'content/socials',
      schema: {
        items: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            handle: fields.text({ label: 'Handle' }),
            url: fields.text({ label: 'URL' }),
          }),
          { label: 'Links', itemLabel: (p) => p.fields.label.value },
        ),
      },
    }),

    about: singleton({
      label: 'Principles and stack',
      path: 'content/about',
      schema: {
        principles: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            text: fields.text({ label: 'Text', multiline: true }),
          }),
          { label: 'Principles', itemLabel: (p) => p.fields.title.value },
        ),
        stackGroups: fields.array(
          fields.object({
            name: fields.text({ label: 'Group' }),
            tools: fields.array(fields.text({ label: 'Tool' }), { label: 'Tools', itemLabel: (p) => p.value }),
          }),
          { label: 'Stack groups', itemLabel: (p) => p.fields.name.value },
        ),
      },
    }),

    ui: singleton({
      label: 'Interface strings',
      path: 'content/ui',
      schema: {
        navWork: fields.text({ label: 'Nav: Work' }),
        navProjects: fields.text({ label: 'Nav: Projects' }),
        navLogs: fields.text({ label: 'Nav: Build logs' }),
        navAbout: fields.text({ label: 'Nav: About' }),
        navContact: fields.text({ label: 'Nav: Contact' }),
        bookCta: fields.text({ label: 'Primary CTA' }),
        moreWaysToMeet: fields.text({ label: 'Booking chooser heading' }),
        resumeLabel: fields.text({ label: 'Résumé button' }),
        recruiterTrigger: fields.text({ label: 'Recruiter trigger' }),
        recruiterEyebrow: fields.text({ label: 'Recruiter trigger eyebrow' }),
        scrollHint: fields.text({ label: 'Scroll hint' }),
        readCaseStudy: fields.text({ label: 'Read case study' }),
        liveLabel: fields.text({ label: 'Live link' }),
        codeLabel: fields.text({ label: 'Code link' }),
        logsTitle: fields.text({ label: 'Logs page title' }),
        logsLead: fields.text({ label: 'Logs page lead', multiline: true }),
        workTitle: fields.text({ label: 'Work label' }),
        footerTagline: fields.text({ label: 'Footer tagline' }),
        copyLabel: fields.text({ label: 'Copy' }),
        copiedLabel: fields.text({ label: 'Copied' }),
      },
    }),
  },

  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'content/projects/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        oneLiner: fields.text({ label: 'One-liner', multiline: true }),
        role: fields.text({ label: 'Role' }),
        year: fields.text({ label: 'Year' }),
        timeline: fields.text({ label: 'Timeline' }),
        team: fields.text({ label: 'Team' }),
        status: fields.text({ label: 'Status (e.g. Pre-launch)' }),
        stack: fields.array(fields.text({ label: 'Tool' }), { label: 'Stack', itemLabel: (p) => p.value }),
        liveUrl: fields.text({ label: 'Live URL (optional)' }),
        codeUrl: fields.text({ label: 'Code URL (optional)' }),
        cover: fields.image({ label: 'Cover (optional)', directory: 'public/screens', publicPath: '/screens/' }),
        coverArt: fields.select({
          label: 'Cover art (used when there is no screenshot)',
          options: [
            { label: 'Blueprint (architecture flow)', value: 'blueprint' },
            { label: 'Storefront wireframe', value: 'storefront' },
          ],
          defaultValue: 'blueprint',
        }),
        coverNodes: fields.array(fields.text({ label: 'Node' }), {
          label: 'Blueprint cover nodes (used when there is no screenshot)',
          itemLabel: (p) => p.value,
        }),
        coverStats: fields.array(
          fields.object({ value: fields.text({ label: 'Value' }), label: fields.text({ label: 'Label' }) }),
          { label: 'Blueprint cover stats', itemLabel: (p) => p.fields.value.value },
        ),
        featured: fields.checkbox({ label: 'Featured on Home', defaultValue: true }),
        order: fields.integer({ label: 'Order', defaultValue: 1 }),
        body: fields.mdx({ label: 'Case study', components }),
      },
    }),

    tools: collection({
      label: 'Open source',
      slugField: 'title',
      path: 'content/tools/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Name' } }),
        tagline: fields.text({ label: 'Tagline', multiline: true }),
        kind: fields.text({ label: 'Kind (e.g. Python package)' }),
        origin: fields.select({
          label: 'Where I built it',
          options: [
            { label: 'At work (tooling)', value: 'work' },
            { label: 'Side project', value: 'side' },
          ],
          defaultValue: 'side',
        }),
        status: fields.text({ label: 'Status' }),
        stack: fields.array(fields.text({ label: 'Tool' }), { label: 'Stack', itemLabel: (p) => p.value }),
        repoUrl: fields.text({ label: 'Repo URL' }),
        siteUrl: fields.text({ label: 'Package / site URL (optional)' }),
        order: fields.integer({ label: 'Order', defaultValue: 1 }),
        body: fields.mdx({ label: 'Page', components }),
      },
    }),

    logs: collection({
      label: 'Build logs',
      slugField: 'title',
      path: 'content/logs/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (p) => p.value }),
        cover: fields.image({ label: 'Cover (optional)', directory: 'public/screens', publicPath: '/screens/' }),
        body: fields.mdx({ label: 'Story', components }),
      },
    }),

    experience: collection({
      label: 'Experience',
      slugField: 'role',
      path: 'content/experience/*',
      format: 'yaml',
      schema: {
        role: fields.slug({ name: { label: 'Role' } }),
        company: fields.text({ label: 'Company' }),
        start: fields.text({ label: 'Start (e.g. Sep 2024)' }),
        end: fields.text({ label: 'End (e.g. Now)' }),
        impact: fields.text({ label: 'Impact line', multiline: true }),
        order: fields.integer({ label: 'Order (1 = newest)', defaultValue: 1 }),
      },
    }),
  },
});
