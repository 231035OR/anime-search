// src/components/AnimeSearch.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AnimeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitial, setIsInitial] = useState(true); // 初期画面かどうか

  const navigate = useNavigate();

  // 初期画面は人気アニメを表示
  useEffect(() => {
    fetchPopularAnimes();
  }, []);

  // 人気アニメ取得
  const fetchPopularAnimes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`https://api.jikan.moe/v4/top/anime`, {
        params: {
          page: 1,
          limit: 10,
        },
      });
      setResults(res.data.data);
      setTotalPages(1);
      setPage(1);
      setIsInitial(true);
    } catch (e) {
      setError("人気アニメの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 検索結果取得
  const fetchAnimes = async (searchQuery = query, pageNum = 1) => {
    if (!searchQuery) {
      // 空検索なら人気アニメ表示に戻す
      fetchPopularAnimes();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`https://api.jikan.moe/v4/anime`, {
        params: {
          q: searchQuery,
          page: pageNum,
          limit: 21,
          order_by: "popularity",
          sort: "desc",
        },
      });
      setResults(res.data.data);
      setTotalPages(res.data.pagination?.last_visible_page || 1);
      setPage(pageNum);
      setIsInitial(false);
    } catch (e) {
      setError("検索結果の取得に失敗しました");
      setResults([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnimes(query, 1);
  };

  const handlePageChange = (newPage) => {
    fetchAnimes(query, newPage);
  };

  const handleSelectAnime = (anime) => {
    navigate(`/anime/${anime.mal_id}`);
  };

  return (
    <div className="container">
      <h1>アニメ検索</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="アニメタイトルを入力"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="アニメタイトル検索"
        />
        <button type="submit" aria-label="検索">
          🔍
        </button>
      </form>

      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && results.length === 0 && <p>該当するアニメがありません。</p>}

      <h2>{isInitial ? "人気アニメ" : `検索結果（${results.length}件）`}</h2>

      <div className="results-grid">
        {results.map((anime) => (
          <div
            key={anime.mal_id}
            className="anime-card"
            onClick={() => handleSelectAnime(anime)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSelectAnime(anime);
            }}
            role="button"
            aria-label={`${anime.title_japanese || anime.title} の詳細を見る`}
          >
            <img
              src={anime.images?.jpg.image_url}
              alt={anime.title_japanese || anime.title}
              loading="lazy"
              className="anime-image"
            />
            <div className="anime-title">{anime.title_japanese || anime.title}</div>
          </div>
        ))}
      </div>

      {!isInitial && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            aria-label="前のページ"
          >
            &lt; 前へ
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="次のページ"
          >
            次へ &gt;
          </button>
        </div>
      )}

      <style>{`
        .container {
          max-width: 900px;
          margin: 2rem auto;
          padding: 0 1rem;
          font-family: sans-serif;
        }
        h1 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #222;
        }
        h2 {
          margin-bottom: 1rem;
          color: #555;
          font-weight: 600;
        }
        .search-form {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        input[type="text"] {
          width: 70%;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px 0 0 4px;
          outline: none;
        }
        input[type="text"]:focus {
          border-color: #007bff;
        }
        button[type="submit"] {
          padding: 0 1rem;
          font-size: 1.2rem;
          background-color: #007bff;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 0 4px 4px 0;
        }
        button[type="submit"]:hover {
          background-color: #0056b3;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill,minmax(140px,1fr));
          gap: 1rem;
        }
        .anime-card {
          cursor: pointer;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgb(0 0 0 / 0.1);
          transition: box-shadow 0.3s ease, transform 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: white;
        }
        .anime-card:hover,
        .anime-card:focus {
          box-shadow: 0 6px 12px rgb(0 0 0 / 0.15);
          transform: translateY(-4px);
          outline: none;
        }
        .anime-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-bottom: 1px solid #eee;
          border-radius: 8px 8px 0 0;
        }
        .anime-title {
          padding: 0.5rem;
          text-align: center;
          font-weight: 600;
          font-size: 0.9rem;
          color: #222;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 90%;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 1.5rem;
          font-size: 1rem;
        }
        .pagination button {
          background-color: #007bff;
          border: none;
          padding: 0.5rem 1rem;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .pagination button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .pagination button:hover:not(:disabled) {
          background-color: #0056b3;
        }

        /* レスポンシブ対応 */
        @media (max-width: 600px) {
          .anime-image {
            height: 150px;
          }
          input[type="text"] {
            width: 60%;
          }
        }
      `}</style>
    </div>
  );
}
