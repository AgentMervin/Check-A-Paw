#!/usr/bin/env python3
"""
Check-A-Paw demo server.

Serves the static PWA AND proxies /api/* to the Azure Functions host so the
browser can call a same-origin relative path (/api/complianceGround) without
CORS headaches.

Usage:
    # Terminal 1 — the Azure Function
    cd api && func start            # listens on :7071

    # Terminal 2 — static site + /api proxy on one origin
    python3 serve.py                # http://localhost:8765

Env overrides:
    PORT       (default 8765)  — port this server listens on
    FUNC_HOST  (default http://localhost:7071) — where to proxy /api/* to
"""
import os
import urllib.request
import urllib.error
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", "8765"))
FUNC_HOST = os.environ.get("FUNC_HOST", "http://localhost:7071").rstrip("/")


class ProxyingHandler(SimpleHTTPRequestHandler):
    """Static file server that forwards /api/* to the Functions host."""

    def _is_api(self):
        return self.path.startswith("/api/")

    def do_GET(self):
        if self._is_api():
            return self._proxy("GET")
        return super().do_GET()

    def do_POST(self):
        if self._is_api():
            return self._proxy("POST")
        self.send_error(405, "Method Not Allowed")

    def do_OPTIONS(self):
        # CORS preflight for the API path.
        if self._is_api():
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            return
        self.send_error(405, "Method Not Allowed")

    def _proxy(self, method):
        target = f"{FUNC_HOST}{self.path}"
        length = int(self.headers.get("Content-Length", 0) or 0)
        body = self.rfile.read(length) if length else None

        req = urllib.request.Request(target, data=body, method=method)
        ctype = self.headers.get("Content-Type")
        if ctype:
            req.add_header("Content-Type", ctype)

        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                payload = resp.read()
                self.send_response(resp.status)
                ct = resp.headers.get("Content-Type", "application/json")
                self.send_header("Content-Type", ct)
                self.send_header("Content-Length", str(len(payload)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(payload)
        except urllib.error.HTTPError as e:
            payload = e.read()
            self.send_response(e.code)
            self.send_header("Content-Type", e.headers.get("Content-Type", "application/json"))
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(payload)
        except urllib.error.URLError as e:
            msg = (
                '{"error":"Azure Function not reachable. Start it with '
                "'cd api && func start'.\","
                f'"detail":"{str(e.reason)}"}}'
            ).encode("utf-8")
            self.send_response(502)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(msg)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(msg)


def main():
    httpd = ThreadingHTTPServer(("", PORT), ProxyingHandler)
    print(f"Check-A-Paw running at http://localhost:{PORT}")
    print(f"  · static files: this folder")
    print(f"  · /api/*  ->  {FUNC_HOST}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        httpd.server_close()


if __name__ == "__main__":
    main()
