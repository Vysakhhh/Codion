import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  GitBranch,
  GitPullRequest,
  Loader2,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  FolderOpen,
  Code
} from 'lucide-react';

function Repositories() {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [pulls, setPulls] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingPulls, setLoadingPulls] = useState(false);
  const [reviewingPr, setReviewingPr] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRepos() {
      try {
        setLoadingRepos(true);
        setError(null);
        const res = await api.get('/api/repos');
        setRepos(res.data.repos || []);
      } catch (err) {
        console.error('Failed to load GitHub repositories:', err);
        setError(err.response?.data?.error || 'Could not fetch your GitHub repositories. Ensure your token is valid.');
      } finally {
        setLoadingRepos(false);
      }
    }
    fetchRepos();
  }, []);

  const handleSelectRepo = async (repo) => {
    setSelectedRepo(repo);
    setPulls([]);
    try {
      setLoadingPulls(true);
      setError(null);
      const res = await api.get(`/api/repos/${repo.owner.login}/${repo.name}/pulls`);
      setPulls(res.data.pulls || []);
    } catch (err) {
      console.error('Failed to load pull requests:', err);
      setError(`Failed to load PRs for ${repo.name}: ` + (err.response?.data?.error || err.message));
    } finally {
      setLoadingPulls(false);
    }
  };

  const handleReviewPr = async (pr) => {
    if (!selectedRepo) return;
    try {
      setReviewingPr(pr.id);
      setError(null);
      const res = await api.post('/api/review/github', {
        owner: selectedRepo.owner.login,
        repo: selectedRepo.name,
        pullNumber: pr.number,
        settings: {
          suppressInfo: false,
          suppressMinor: false,
          maxComments: 25,
          preferredProvider: 'auto'
        }
      });
      const reviewId = res.data.id;
      navigate(`/review/${reviewId}`);
    } catch (err) {
      console.error('Failed to trigger review:', err);
      setError(err.response?.data?.error || 'Review generation failed. Please try again.');
    } finally {
      setReviewingPr(null);
    }
  };

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto pb-24">

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-[#333]">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-medium border border-slate-200 dark:border-[#333] text-black dark:text-[#ededed] mb-4">
          <GitBranch className="w-3 h-3" /> Repository Connection
        </div>
        <h1 className="text-3xl font-semibold text-black dark:text-[#ededed] tracking-tight mb-2">Select Repository</h1>
        <p className="text-sm text-slate-500 dark:text-[#888]">Pick a codebase module to trigger a pull request review session.</p>
      </div>

      {error && (
        <div className="p-4 mb-8 border border-red-200 dark:border-red-900/50 rounded-md text-red-600 dark:text-red-400 text-sm flex items-center justify-between bg-red-50 dark:bg-[#111]">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs hover:underline ml-4">Dismiss</button>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-stretch">

        {/* Left Side: Repositories List */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#333] focus-within:border-black dark:focus-within:border-[#666] transition-colors">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#666]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories..."
              className="bg-transparent text-sm text-black dark:text-[#ededed] w-full outline-none placeholder-slate-400 dark:placeholder-[#555]"
            />
          </div>

          {loadingRepos ? (
            <div className="vercel-card flex-1 flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="w-7 h-7 text-black dark:text-white animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-500 dark:text-[#888]">Loading repositories from GitHub...</p>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="vercel-card flex-1 flex flex-col items-center justify-center py-16 text-center border-dashed">
              <div className="w-11 h-11 border border-slate-200 dark:border-[#333] rounded-full flex items-center justify-center mx-auto mb-5">
                <FolderOpen className="w-5 h-5 text-slate-400 dark:text-[#666]" />
              </div>
              <h3 className="text-base font-medium text-black dark:text-[#ededed] mb-1.5">No Repositories Found</h3>
              <p className="text-sm text-slate-500 dark:text-[#888] max-w-xs mx-auto">Make sure you have repositories available on your connected account.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRepos.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => handleSelectRepo(repo)}
                  className={`vercel-card p-5 text-left transition-all group relative ${
                    selectedRepo?.id === repo.id
                      ? 'border-black dark:border-white'
                      : 'hover:border-slate-400 dark:hover:border-[#666]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-[#888] bg-slate-50 dark:bg-[#111] px-2 py-0.5 rounded border border-slate-200 dark:border-[#333] uppercase">
                      {repo.language || 'Text'}
                    </span>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 dark:text-[#666] hover:text-black dark:hover:text-white transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <h3 className="text-sm font-medium text-black dark:text-[#ededed] mb-2 truncate group-hover:underline">
                    {repo.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#888] line-clamp-2 mb-4 leading-relaxed">
                    {repo.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 dark:text-[#666] uppercase pt-3 border-t border-slate-100 dark:border-[#333]">
                    <span>{repo.isPrivate ? 'Private' : 'Public'}</span>
                    <span className="group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-1">
                      Browse PRs <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Pull Requests */}
        <div className="vercel-card p-6 flex flex-col">
          <h2 className="text-sm font-medium text-black dark:text-[#ededed] mb-6 flex items-center gap-3">
            <GitPullRequest className="w-4 h-4 text-slate-500 dark:text-[#888]" />
            {selectedRepo ? `PRs — ${selectedRepo.name}` : 'Pull Requests'}
          </h2>

          {!selectedRepo ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="w-11 h-11 border border-slate-200 dark:border-[#333] rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-5 h-5 text-slate-400 dark:text-[#666]" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-[#888]">Select a Repository</p>
              <p className="text-xs text-slate-400 dark:text-[#666] mt-2 max-w-[200px] mx-auto">Click a repo on the left to view pull requests.</p>
            </div>
          ) : loadingPulls ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <Loader2 className="w-7 h-7 text-black dark:text-white animate-spin mx-auto mb-4" />
              <p className="text-xs text-slate-500 dark:text-[#888]">Retrieving pull requests...</p>
            </div>
          ) : pulls.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShieldCheck className="w-9 h-9 text-green-500/40 mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-500 dark:text-[#888]">No Open Pull Requests</p>
              <p className="text-xs text-slate-400 dark:text-[#666] mt-2 max-w-[220px] mx-auto">No open PRs found on this repository.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {pulls.map((pr) => (
                <div
                  key={pr.id}
                  className="p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#333] rounded-md hover:border-slate-400 dark:hover:border-[#555] transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={pr.user.avatarUrl}
                      alt={pr.user.login}
                      className="w-5 h-5 rounded-full border border-slate-200 dark:border-[#333]"
                    />
                    <span className="text-[10px] font-medium text-slate-500 dark:text-[#888]">{pr.user.login}</span>
                    <span className="ml-auto text-[10px] font-mono text-slate-400 dark:text-[#666]">#{pr.number}</span>
                  </div>
                  <h4 className="text-sm font-medium text-black dark:text-[#ededed] mb-3 leading-snug line-clamp-2">
                    {pr.title}
                  </h4>
                  <button
                    onClick={() => handleReviewPr(pr)}
                    disabled={reviewingPr !== null}
                    className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-2"
                  >
                    {reviewingPr === pr.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating Audit...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        Review Pull Request
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Repositories;
