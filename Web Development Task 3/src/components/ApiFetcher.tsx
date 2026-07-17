import React, { useState, useEffect } from 'react';
import { 
  Globe, Play, Code, Check, AlertTriangle, Cpu, HelpCircle,
  TrendingUp, CloudSun, Smile, Sparkles, Database 
} from 'lucide-react';
import { SelectedApi, ApiResponseData } from '../types';

interface ApiConfig {
  name: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  sampleCode: string;
}

const API_CONFIGS: Record<SelectedApi, ApiConfig> = {
  joke: {
    name: "Official Programming Joke API",
    url: "https://official-joke-api.appspot.com/jokes/programming/random",
    description: "Fetches a random, light-hearted programmer joke with a dynamic punchline reveal.",
    icon: <Smile className="w-4 h-4 text-emerald-400" />,
    sampleCode: `// Fetch random programming joke
async function getProgrammingJoke() {
  const url = "https://official-joke-api.appspot.com/jokes/programming/random";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    console.log(data[0].setup, data[0].punchline);
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}`
  },
  weather: {
    name: "Open-Meteo Weather API",
    url: "https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
    description: "Fetches live weather measurements (temperature, wind, humidity) for Paris, France in real-time.",
    icon: <CloudSun className="w-4 h-4 text-sky-400" />,
    sampleCode: `// Fetch real-time weather from Open-Meteo
async function getLiveWeather() {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const current = data.current;
    console.log(\`Temp: \${current.temperature_2m}°C, Humidity: \${current.relative_humidity_2m}%\`);
  } catch (error) {
    console.error("Weather load failed:", error);
  }
}`
  },
  user: {
    name: "Random User Generator API",
    url: "https://randomuser.me/api/?results=1",
    description: "Generates authentic random user profile profiles (photo, name, address) dynamically.",
    icon: <Globe className="w-4 h-4 text-indigo-400" />,
    sampleCode: `// Fetch random user profiles
async function getRandomUser() {
  const url = "https://randomuser.me/api/?results=1";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const user = data.results[0];
    console.log(\`User: \${user.name.first} \${user.name.last}\`);
  } catch (err) {
    console.error(err);
  }
}`
  },
  crypto: {
    name: "CoinGecko Price API",
    url: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true",
    description: "Fetches official cryptocurrency exchange prices for Bitcoin, Ethereum, and Solana with 24h change.",
    icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
    sampleCode: `// Fetch live crypto price quotes
async function getCryptoPrices() {
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true";
  try {
    const res = await fetch(url);
    const prices = await res.json();
    console.log(\`BTC: \$\${prices.bitcoin.usd}, ETH: \$\${prices.ethereum.usd}\`);
  } catch (err) {
    console.error(err);
  }
}`
  },
  dog: {
    name: "Dog Breeds API",
    url: "https://dog.ceo/api/breeds/image/random",
    description: "Fetches a high-quality, completely random dog image URL from the Dog CEO index.",
    icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    sampleCode: `// Fetch random dog image
async function getRandomDog() {
  const url = "https://dog.ceo/api/breeds/image/random";
  try {
    const res = await fetch(url);
    const payload = await res.json();
    console.log("Dog image URL:", payload.message);
  } catch (err) {
    console.error(err);
  }
}`
  }
};

export default function ApiFetcher() {
  const [selectedApi, setSelectedApi] = useState<SelectedApi>('joke');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponseData | null>(null);
  const [punchlineRevealed, setPunchlineRevealed] = useState(false);

  // Auto fetch initial joke on load so the screen isn't empty
  useEffect(() => {
    fetchData();
  }, [selectedApi]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setPunchlineRevealed(false);
    const startTime = performance.now();
    const config = API_CONFIGS[selectedApi];

    try {
      const response = await fetch(config.url);
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const body = await response.json();

      // Mock some standard headers for the UI console
      const headers: Record<string, string> = {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=60",
        "server": "cloudflare",
        "x-dns-prefetch-control": "off"
      };

      setApiResponse({
        url: config.url,
        status: response.status,
        timeMs,
        headers,
        body
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to establish network connection.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse weather codes into clean descriptions
  const getWeatherDesc = (code: number) => {
    if (code === 0) return "Clear Sky ☀️";
    if (code <= 3) return "Partly Cloudy ⛅";
    if (code <= 48) return "Foggy 🌫️";
    if (code <= 55) return "Drizzle 🌧️";
    if (code <= 82) return "Rainy 🌧️";
    return "Stormy 🌩️";
  };

  return (
    <div className="space-y-6" id="api-fetcher-root">
      {/* Intro Box */}
      <div className="bg-white border-2 border-neutral-900 rounded-[2rem] p-6 flex flex-col md:flex-row items-start gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-3 bg-emerald-100 text-emerald-800 border-2 border-neutral-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Globe className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-lg font-black text-neutral-900 font-sans">Task 3: Fetching Real-Time Data from APIs</h3>
          <p className="text-neutral-600 text-sm mt-1 leading-relaxed font-semibold">
            In modern Javascript, the `fetch()` function acts as a bridge to retrieve external server-side data asynchronously. Select from the secure public endpoints below, trigger a request, and inspect both raw structures and visual output cards.
          </p>
        </div>
      </div>

      {/* Target API Selection Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3" id="api-select-rail">
        {(Object.keys(API_CONFIGS) as SelectedApi[]).map((apiKey) => {
          const cfg = API_CONFIGS[apiKey];
          const isSelected = selectedApi === apiKey;
          return (
            <button
              key={apiKey}
              onClick={() => setSelectedApi(apiKey)}
              className={`p-3 rounded-xl border-2 text-left flex flex-col justify-between min-h-[95px] transition-all ${
                isSelected
                  ? 'bg-indigo-500 border-neutral-900 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-0.5'
                  : 'bg-white border-neutral-900 text-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-50 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
              id={`api-btn-${apiKey}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-neutral-100 border border-neutral-300'}`}>
                  {cfg.icon}
                </span>
                {isSelected && <Check className="w-4 h-4 text-white font-bold stroke-[3]" />}
              </div>
              <span className="text-[11px] font-black tracking-tight leading-snug font-sans mt-2">
                {cfg.name.split(" ")[0]} API
              </span>
            </button>
          );
        })}
      </div>

      {/* API Endpoint Panel & Trigger */}
      <div className="bg-white border-2 border-neutral-900 rounded-[2rem] p-5 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-100 p-3.5 rounded-xl border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="font-mono text-xs overflow-x-auto whitespace-nowrap text-neutral-800 py-1 max-w-full font-bold flex items-center gap-2">
            <span className="bg-emerald-400 border border-neutral-900 text-neutral-900 font-black px-2 py-0.5 rounded text-[10px]">GET</span>
            <span>{API_CONFIGS[selectedApi].url}</span>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-neutral-200 text-white disabled:text-neutral-400 rounded-xl border-2 border-neutral-900 text-xs font-black flex items-center justify-center gap-2 shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            id="trigger-fetch-btn"
          >
            <Play className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''} stroke-[2.5]`} />
            {loading ? "Fetching..." : "Fetch Live Data"}
          </button>
        </div>

        <p className="text-xs text-neutral-500 leading-normal font-bold">
          {API_CONFIGS[selectedApi].description}
        </p>
      </div>

      {/* Result Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="api-result-workspace">
        {/* Raw JSON Code Viewer */}
        <div className="bg-white border-2 border-neutral-900 rounded-[2rem] overflow-hidden flex flex-col min-h-[300px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-neutral-100 px-4 py-3 border-b-2 border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-neutral-900 font-sans">
              <Database className="w-4 h-4 text-indigo-500 stroke-[2.5]" />
              <span>Raw JSON Response</span>
            </div>
            {apiResponse && (
              <span className="text-[10px] font-mono font-black text-indigo-600 bg-white border-2 border-neutral-900 px-2.5 py-0.5 rounded shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                HTTP {apiResponse.status} • {apiResponse.timeMs}ms
              </span>
            )}
          </div>

          <div className="p-4 bg-neutral-950 flex-1 overflow-auto max-h-[360px] relative font-mono text-[11px] leading-relaxed border-t border-neutral-900">
            {loading ? (
              <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center text-neutral-400 text-xs font-semibold">
                Establishing connection and fetching JSON headers...
              </div>
            ) : error ? (
              <div className="text-rose-400 flex items-start gap-2 p-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-xs">Fetch Request Failed</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">{error}</p>
                </div>
              </div>
            ) : apiResponse ? (
              <pre className="text-indigo-400">
                <code>{JSON.stringify(apiResponse.body, null, 2)}</code>
              </pre>
            ) : (
              <span className="text-neutral-500">No request sent yet. Click 'Fetch Live Data' to trigger network task.</span>
            )}
          </div>
        </div>

        {/* Formatted Render Panel & Code Snippet */}
        <div className="space-y-4">
          {/* Dynamic Render Card */}
          <div className="bg-white border-2 border-neutral-900 rounded-[2rem] p-5 min-h-[160px] flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-black block mb-4 border-b-2 border-neutral-100 pb-2">
              🖥️ Dynamic Client Render
            </span>

            <div className="flex-1 flex flex-col justify-center">
              {loading ? (
                <div className="text-center py-6 text-xs text-neutral-400 font-semibold">Assembling visual components...</div>
              ) : apiResponse ? (
                /* Dynamic Rendering Logic based on selected api */
                <div id="dynamic-render-card">
                  {selectedApi === 'joke' && (
                    <div className="space-y-4">
                      <div className="bg-neutral-100 p-4 rounded-xl border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-sm font-black text-neutral-900">
                          "{apiResponse.body[0]?.setup || "Why do programmers wear glasses?"}"
                        </p>
                        {punchlineRevealed ? (
                          <p className="text-sm text-indigo-600 font-extrabold mt-3 font-mono block">
                            → {apiResponse.body[0]?.punchline || "Because they can't C#!"}
                          </p>
                        ) : (
                          <button
                            onClick={() => setPunchlineRevealed(true)}
                            className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-xl border-2 border-neutral-900 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                            id="reveal-punchline-btn"
                          >
                            Reveal Punchline! 😄
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedApi === 'weather' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-neutral-100 p-4 rounded-xl border-2 border-neutral-900 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <span className="text-[10px] font-mono text-neutral-400 font-black block">PARIS TEMP</span>
                        <span className="text-2xl font-black font-mono text-indigo-600 mt-1 block">
                          {apiResponse.body.current?.temperature_2m}°C
                        </span>
                      </div>
                      <div className="bg-neutral-100 p-4 rounded-xl border-2 border-neutral-900 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <span className="text-[10px] font-mono text-neutral-400 font-black block">WEATHER STATE</span>
                        <span className="text-xs font-black text-neutral-900 mt-2 block">
                          {getWeatherDesc(apiResponse.body.current?.weather_code)}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedApi === 'user' && apiResponse.body.results?.[0] && (
                    <div className="flex items-center gap-4 bg-neutral-100 p-4 rounded-xl border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <img
                        src={apiResponse.body.results[0].picture.medium}
                        alt="Profile avatar"
                        className="w-14 h-14 rounded-full border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-black text-neutral-900">
                          {apiResponse.body.results[0].name.title} {apiResponse.body.results[0].name.first} {apiResponse.body.results[0].name.last}
                        </h4>
                        <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{apiResponse.body.results[0].email}</p>
                        <p className="text-[10px] text-indigo-600 font-black mt-0.5">{apiResponse.body.results[0].location.city}, {apiResponse.body.results[0].location.country}</p>
                      </div>
                    </div>
                  )}

                  {selectedApi === 'dog' && (
                    <div className="bg-neutral-100 p-2.5 rounded-xl border-2 border-neutral-900 flex flex-col items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <img
                        src={apiResponse.body.message}
                        alt="Dog breed fetch result"
                        className="max-h-[140px] rounded-lg object-contain w-full border border-neutral-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {selectedApi === 'crypto' && (
                    <div className="space-y-2.5">
                      {['bitcoin', 'ethereum', 'solana'].map((coin) => {
                        const coinData = apiResponse.body[coin];
                        if (!coinData) return null;
                        return (
                          <div key={coin} className="flex justify-between items-center bg-neutral-100 p-2.5 px-3.5 rounded-xl border-2 border-neutral-900 text-xs font-mono shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                            <span className="capitalize text-neutral-900 font-black">{coin}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-indigo-600 font-black">${coinData.usd.toLocaleString()}</span>
                              <span className={`text-[10px] font-black ${coinData.usd_24h_change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {coinData.usd_24h_change >= 0 ? '+' : ''}{coinData.usd_24h_change?.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-neutral-400 font-semibold font-sans">
                  Awaiting request... Once triggered, visual components will compile here.
                </div>
              )}
            </div>
          </div>

          {/* JS Implementation Snippet */}
          <div className="bg-white border-2 border-neutral-900 rounded-[2rem] overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-neutral-100 px-4 py-2.5 border-b-2 border-neutral-900 flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-900 uppercase font-black flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                Javascript Fetch Code Snippet
              </span>
            </div>
            <div className="p-4 bg-neutral-950 overflow-x-auto font-mono text-[10px] text-indigo-300 max-h-[140px] border-t border-neutral-900">
              <pre>
                <code>{API_CONFIGS[selectedApi].sampleCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
