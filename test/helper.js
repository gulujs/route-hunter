import * as fs from 'fs';
import * as Path from 'path';
import { fileURLToPath } from 'url';

const __dirname = Path.dirname(fileURLToPath(import.meta.url));

export const githubApiParamFiller = {
  owner: 'gulujs',
  repo: 'route-hunter',
  artifact_id: '42',
  archive_format: 'ARCHIVE_FORMAT',
  run_id: '42',
  org: 'gulujs',
  secret_name: 'SECRET_NAME',
  repository_id: '42',
  runner_id: '42',
  runner_group_id: '42',
  workflow_id: '42',
  job_id: '42',
  username: 'gulujs',
  thread_id: '42',
  code: 'CODE',
  installation_id: '42',
  app_slug: 'route-hunter',
  client_id: 'CLIENT_ID',
  access_token: 'ACCESS_TOKEN',
  content_reference_id: '42',
  account_id: '42',
  plan_id: '42',
  check_run_id: '42',
  check_suite_id: '42',
  ref: 'REF',
  alert_number: '42',
  key: 'KEY',
  enterprise: 'gulujs',
  org_id: '42',
  scim_group_id: 'SCIM_GROUP_ID',
  scim_user_id: 'SCIM_USER_ID',
  gist_id: 'GIST_ID',
  sha: 'SHA',
  comment_id: '42',
  file_sha: 'FILE_SHA',
  commit_sha: 'COMMIT_SHA',
  tag_sha: 'TAG_SHA',
  tree_sha: 'TREE_SHA',
  name: 'Node',
  issue_number: '42',
  assignee: 'ASSIGNEE',
  event_id: '42',
  milestone_number: '42',
  license: 'mit',
  migration_id: '42',
  repo_name: 'route-hunter',
  author_id: '42',
  grant_id: '42',
  fingerprint: 'FINGERPRINT',
  authorization_id: '42',
  credential_id: '42',
  invitation_id: '42',
  hook_id: '42',
  project_id: '42',
  card_id: '42',
  column_id: '42',
  pull_number: '42',
  review_id: '42',
  team_slug: 'gulujs',
  discussion_number: '42',
  comment_number: '42',
  reaction_id: '42',
  team_id: '42',
  template_owner: 'TEMPLATE_OWNER',
  template_repo: 'TEMPLATE_REPO',
  branch: 'BRANCH',
  base: 'BASE',
  head: 'HEAD',
  path: 'PATH',
  key_id: '42',
  deployment_id: '42',
  status_id: '42',
  build_id: '42',
  asset_id: '42',
  tag: 'TAG',
  release_id: '42',
  target_user: 'gulujs',
  gpg_key_id: '42'
};

export const getGithubApis = () => {
  return fs.readFileSync(`${__dirname}/fixtures/github-api.txt`, 'utf-8').split('\n').reduce((apis, line) => {
    if (!line || line.startsWith('#')) {
      return apis;
    }

    const [method, path] = line.split(' ');
    const pnames = [];
    const handlerPath = path.replace(/\{([^}]+)\}/g, (_, pname) => {
      pnames.push(pname);
      return `:${pname}`;
    });

    apis.push({
      method: method.toUpperCase(),
      handlerPath,
      pnames,
      reqPath: path.replace(/\{([^}]+)\}/g, (_, pname) => githubApiParamFiller[pname]),
      // eslint-disable-next-line no-empty-function
      handler: (req, res, params, store) => {}
    });

    return apis;
  }, []);
};
