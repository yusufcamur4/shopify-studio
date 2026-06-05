export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const SeoPartsFragmentDoc = gql`
    fragment SeoParts on Seo {
  __typename
  title
  description
  og_image
  keywords
}
    `;
export const HeroPartsFragmentDoc = gql`
    fragment HeroParts on Hero {
  __typename
  eyebrow
  eyebrow_en
  title_tr
  title_en
  lede
  lede_en
  credits_label
  credits_label_en
  chips
  chip_last
  chip_last_en
  cta_primary
  cta_primary_en
  cta_secondary
  cta_secondary_en
  scroll
  scroll_en
  marquee1 {
    __typename
    tr
    en
  }
  marquee2 {
    __typename
    tr
    en
  }
}
    `;
export const HakkindaPartsFragmentDoc = gql`
    fragment HakkindaParts on Hakkinda {
  __typename
  eyebrow
  eyebrow_en
  heading_pre
  heading_whisper
  heading_post
  heading_pre_en
  heading_whisper_en
  heading_post_en
  p1
  p1_en
  p2
  p2_en
  expertise_label
  expertise_label_en
  expertise
  expertise_en
  signature_label
  signature_label_en
  signature
}
    `;
export const YeteneklerPartsFragmentDoc = gql`
    fragment YeteneklerParts on Yetenekler {
  __typename
  lede
  lede_en
  techstack_label
  techstack_label_en
  techstack
  skills {
    __typename
    tag
    tag_en
    title
    title_en
    lead
    lead_en
    body
    body_en
    items {
      __typename
      tr
      en
    }
    tags
  }
}
    `;
export const SurecPartsFragmentDoc = gql`
    fragment SurecParts on Surec {
  __typename
  eyebrow
  eyebrow_en
  intro
  intro_en
  steps {
    __typename
    n_label
    n_label_en
    title
    title_en
    body
    body_en
  }
}
    `;
export const IletisimPartsFragmentDoc = gql`
    fragment IletisimParts on Iletisim {
  __typename
  eyebrow
  eyebrow_en
  title_pre
  title_whisper
  title_post
  title_pre_en
  title_whisper_en
  title_post_en
  lede
  lede_en
  cta
  cta_en
  tag
  tag_en
}
    `;
export const FormPartsFragmentDoc = gql`
    fragment FormParts on Form {
  __typename
  aside_eyebrow
  aside_eyebrow_en
  aside_title
  aside_title_en
  aside_lede
  aside_lede_en
  name_label
  name_label_en
  name_ph
  name_ph_en
  email_ph
  email_ph_en
  phone_label
  phone_label_en
  phone_ph
  phone_ph_en
  type_label
  type_label_en
  options {
    __typename
    value
    label
    label_en
  }
  msg_label
  msg_label_en
  msg_ph
  msg_ph_en
  submit
  submit_en
  subject
}
    `;
export const AyarlarPartsFragmentDoc = gql`
    fragment AyarlarParts on Ayarlar {
  __typename
  phone
  phone_display
  email
  location
  location_en
}
    `;
export const FooterPartsFragmentDoc = gql`
    fragment FooterParts on Footer {
  __typename
  tag
  tag_en
  col1_title
  col1 {
    __typename
    label
    label_en
    href
  }
  col2_title
  col2_title_en
  col2 {
    __typename
    label
    label_en
    href
  }
  col3_title
  col3_title_en
  col4_title
  copyright
  studio
  studio_en
  rights
  rights_en
}
    `;
export const MenuPartsFragmentDoc = gql`
    fragment MenuParts on Menu {
  __typename
  submenu_title
  submenu_title_en
  submenu {
    __typename
    label
    label_en
    href
  }
  meta1
  caption
  caption_en
}
    `;
export const EtiketlerPartsFragmentDoc = gql`
    fragment EtiketlerParts on Etiketler {
  __typename
  items {
    __typename
    key
    tr
    en
  }
}
    `;
export const LandingsPartsFragmentDoc = gql`
    fragment LandingsParts on Landings {
  __typename
  crumb
  crumb_en
  eyebrow
  eyebrow_en
  title
  title_en
  lede
  lede_en
  project
  cta
  cta_en
  cta2
  cta2_en
  image
  image_alt
  trust {
    __typename
    value
    label
    label_en
  }
  benefits {
    __typename
    title
    title_en
    body
    body_en
  }
  includes {
    __typename
    tr
    en
  }
  steps {
    __typename
    title
    title_en
    body
    body_en
  }
  faq {
    __typename
    q
    q_en
    a
    a_en
  }
  band_h
  band_h_en
  band_p
  band_p_en
  band_cta
  band_cta_en
}
    `;
export const ProjelerPartsFragmentDoc = gql`
    fragment ProjelerParts on Projeler {
  __typename
  title
  title_en
  order
  category {
    ... on Kategoriler {
      __typename
      name
      name_en
      slug
      order
    }
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
  }
  badge
  badge_en
  metric
  metric_en
  url
  cover
  featured
  body
}
    `;
export const KategorilerPartsFragmentDoc = gql`
    fragment KategorilerParts on Kategoriler {
  __typename
  name
  name_en
  slug
  order
}
    `;
export const SeoDocument = gql`
    query seo($relativePath: String!) {
  seo(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...SeoParts
  }
}
    ${SeoPartsFragmentDoc}`;
export const SeoConnectionDocument = gql`
    query seoConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SeoFilter) {
  seoConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...SeoParts
      }
    }
  }
}
    ${SeoPartsFragmentDoc}`;
export const HeroDocument = gql`
    query hero($relativePath: String!) {
  hero(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...HeroParts
  }
}
    ${HeroPartsFragmentDoc}`;
export const HeroConnectionDocument = gql`
    query heroConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HeroFilter) {
  heroConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...HeroParts
      }
    }
  }
}
    ${HeroPartsFragmentDoc}`;
export const HakkindaDocument = gql`
    query hakkinda($relativePath: String!) {
  hakkinda(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...HakkindaParts
  }
}
    ${HakkindaPartsFragmentDoc}`;
export const HakkindaConnectionDocument = gql`
    query hakkindaConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HakkindaFilter) {
  hakkindaConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...HakkindaParts
      }
    }
  }
}
    ${HakkindaPartsFragmentDoc}`;
export const YeteneklerDocument = gql`
    query yetenekler($relativePath: String!) {
  yetenekler(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...YeteneklerParts
  }
}
    ${YeteneklerPartsFragmentDoc}`;
export const YeteneklerConnectionDocument = gql`
    query yeteneklerConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: YeteneklerFilter) {
  yeteneklerConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...YeteneklerParts
      }
    }
  }
}
    ${YeteneklerPartsFragmentDoc}`;
export const SurecDocument = gql`
    query surec($relativePath: String!) {
  surec(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...SurecParts
  }
}
    ${SurecPartsFragmentDoc}`;
export const SurecConnectionDocument = gql`
    query surecConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SurecFilter) {
  surecConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...SurecParts
      }
    }
  }
}
    ${SurecPartsFragmentDoc}`;
export const IletisimDocument = gql`
    query iletisim($relativePath: String!) {
  iletisim(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...IletisimParts
  }
}
    ${IletisimPartsFragmentDoc}`;
export const IletisimConnectionDocument = gql`
    query iletisimConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: IletisimFilter) {
  iletisimConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...IletisimParts
      }
    }
  }
}
    ${IletisimPartsFragmentDoc}`;
export const FormDocument = gql`
    query form($relativePath: String!) {
  form(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...FormParts
  }
}
    ${FormPartsFragmentDoc}`;
export const FormConnectionDocument = gql`
    query formConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: FormFilter) {
  formConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...FormParts
      }
    }
  }
}
    ${FormPartsFragmentDoc}`;
export const AyarlarDocument = gql`
    query ayarlar($relativePath: String!) {
  ayarlar(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...AyarlarParts
  }
}
    ${AyarlarPartsFragmentDoc}`;
export const AyarlarConnectionDocument = gql`
    query ayarlarConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: AyarlarFilter) {
  ayarlarConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...AyarlarParts
      }
    }
  }
}
    ${AyarlarPartsFragmentDoc}`;
export const FooterDocument = gql`
    query footer($relativePath: String!) {
  footer(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...FooterParts
  }
}
    ${FooterPartsFragmentDoc}`;
export const FooterConnectionDocument = gql`
    query footerConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: FooterFilter) {
  footerConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...FooterParts
      }
    }
  }
}
    ${FooterPartsFragmentDoc}`;
export const MenuDocument = gql`
    query menu($relativePath: String!) {
  menu(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...MenuParts
  }
}
    ${MenuPartsFragmentDoc}`;
export const MenuConnectionDocument = gql`
    query menuConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: MenuFilter) {
  menuConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...MenuParts
      }
    }
  }
}
    ${MenuPartsFragmentDoc}`;
export const EtiketlerDocument = gql`
    query etiketler($relativePath: String!) {
  etiketler(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...EtiketlerParts
  }
}
    ${EtiketlerPartsFragmentDoc}`;
export const EtiketlerConnectionDocument = gql`
    query etiketlerConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: EtiketlerFilter) {
  etiketlerConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...EtiketlerParts
      }
    }
  }
}
    ${EtiketlerPartsFragmentDoc}`;
export const LandingsDocument = gql`
    query landings($relativePath: String!) {
  landings(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...LandingsParts
  }
}
    ${LandingsPartsFragmentDoc}`;
export const LandingsConnectionDocument = gql`
    query landingsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: LandingsFilter) {
  landingsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...LandingsParts
      }
    }
  }
}
    ${LandingsPartsFragmentDoc}`;
export const ProjelerDocument = gql`
    query projeler($relativePath: String!) {
  projeler(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ProjelerParts
  }
}
    ${ProjelerPartsFragmentDoc}`;
export const ProjelerConnectionDocument = gql`
    query projelerConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ProjelerFilter) {
  projelerConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ProjelerParts
      }
    }
  }
}
    ${ProjelerPartsFragmentDoc}`;
export const KategorilerDocument = gql`
    query kategoriler($relativePath: String!) {
  kategoriler(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...KategorilerParts
  }
}
    ${KategorilerPartsFragmentDoc}`;
export const KategorilerConnectionDocument = gql`
    query kategorilerConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: KategorilerFilter) {
  kategorilerConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...KategorilerParts
      }
    }
  }
}
    ${KategorilerPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    seo(variables, options) {
      return requester(SeoDocument, variables, options);
    },
    seoConnection(variables, options) {
      return requester(SeoConnectionDocument, variables, options);
    },
    hero(variables, options) {
      return requester(HeroDocument, variables, options);
    },
    heroConnection(variables, options) {
      return requester(HeroConnectionDocument, variables, options);
    },
    hakkinda(variables, options) {
      return requester(HakkindaDocument, variables, options);
    },
    hakkindaConnection(variables, options) {
      return requester(HakkindaConnectionDocument, variables, options);
    },
    yetenekler(variables, options) {
      return requester(YeteneklerDocument, variables, options);
    },
    yeteneklerConnection(variables, options) {
      return requester(YeteneklerConnectionDocument, variables, options);
    },
    surec(variables, options) {
      return requester(SurecDocument, variables, options);
    },
    surecConnection(variables, options) {
      return requester(SurecConnectionDocument, variables, options);
    },
    iletisim(variables, options) {
      return requester(IletisimDocument, variables, options);
    },
    iletisimConnection(variables, options) {
      return requester(IletisimConnectionDocument, variables, options);
    },
    form(variables, options) {
      return requester(FormDocument, variables, options);
    },
    formConnection(variables, options) {
      return requester(FormConnectionDocument, variables, options);
    },
    ayarlar(variables, options) {
      return requester(AyarlarDocument, variables, options);
    },
    ayarlarConnection(variables, options) {
      return requester(AyarlarConnectionDocument, variables, options);
    },
    footer(variables, options) {
      return requester(FooterDocument, variables, options);
    },
    footerConnection(variables, options) {
      return requester(FooterConnectionDocument, variables, options);
    },
    menu(variables, options) {
      return requester(MenuDocument, variables, options);
    },
    menuConnection(variables, options) {
      return requester(MenuConnectionDocument, variables, options);
    },
    etiketler(variables, options) {
      return requester(EtiketlerDocument, variables, options);
    },
    etiketlerConnection(variables, options) {
      return requester(EtiketlerConnectionDocument, variables, options);
    },
    landings(variables, options) {
      return requester(LandingsDocument, variables, options);
    },
    landingsConnection(variables, options) {
      return requester(LandingsConnectionDocument, variables, options);
    },
    projeler(variables, options) {
      return requester(ProjelerDocument, variables, options);
    },
    projelerConnection(variables, options) {
      return requester(ProjelerConnectionDocument, variables, options);
    },
    kategoriler(variables, options) {
      return requester(KategorilerDocument, variables, options);
    },
    kategorilerConnection(variables, options) {
      return requester(KategorilerConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "https://content.tinajs.io/2.4/content/28caa49d-6290-4365-aadc-e2a36521523a/github/main",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
