// Empty the file during actual development

import { useEffect, useState } from "react";

interface Member {
  username: string;
  name: string;
}

interface GitHubStats {
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export default function TeamPage() {
  const members: Member[] = [
    { username: "aditsuru-git", name: "Adit Suru" },
    { username: "CheefLofter", name: "Cheef Lofter" },
    { username: "duy4nt", name: "Duy Ant" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4">Meet the Team</h1>
        <p className="text-gray-400 text-center mb-16">
          Building something awesome together
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {members.map((member) => (
            <MemberCard key={member.username} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MemberCard({ username, name }: Member) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 text-center animate-pulse">
        <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

<<<<<<< HEAD
	return (
		<a
			href={`https://github.com/${username}`}
			target="_blank"
			rel="noopener noreferrer"
			className="bg-gray-800 rounded-xl p-8 text-center hover:bg-gray-750 transition-all shadow-2xl hover:scale-105 hover:shadow-xl"
		>
			<img
				src={stats?.avatar_url || `https://github.com/${username}.png`}
				alt={username}
				className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700"
			/>
			<h2 className="text-2xl font-bold mb-1">{stats?.name || name}</h2>
			<p className="text-gray-400 mb-4">@{username}</p>
=======
  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-800 rounded-xl p-8 text-center hover:bg-gray-750 transition-all hover:scale-105 hover:shadow-xl"
    >
      <img
        src={stats?.avatar_url || `https://github.com/${username}.png`}
        alt={username}
        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700"
      />
      <h2 className="text-2xl font-bold mb-1">{stats?.name || name}</h2>
      <p className="text-gray-400 mb-4">@{username}</p>
>>>>>>> upstream/main

      {stats && (
        <div className="flex justify-center gap-6 text-sm">
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {stats.public_repos}
            </div>
            <div className="text-gray-500">Repos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {stats.followers}
            </div>
            <div className="text-gray-500">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {stats.following}
            </div>
            <div className="text-gray-500">Following</div>
          </div>
        </div>
      )}
    </a>
  );
}
