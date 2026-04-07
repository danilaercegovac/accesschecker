const form = document.getElementById("analyze-form");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const urlInput = document.getElementById("siteUrl");
	const url = urlInput.value.trim();

	if (!url) {
		statusEl.textContent = "Введите URL сайта.";
		return;
	}

	statusEl.textContent = "Идёт анализ и формирование PDF...";

	try {
		const response = await fetch("/api/analyze", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ url })
		});

		if (!response.ok) {
			let errorMessage = "Ошибка при анализе сайта.";
			try {
				const errorData = await response.json();
				errorMessage = errorData.error || errorMessage;
			} catch {}
			throw new Error(errorMessage);
		}

		const blob = await response.blob();
		const downloadUrl = window.URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = downloadUrl;
		a.download = "report.pdf";
		document.body.appendChild(a);
		a.click();
		a.remove();

		window.URL.revokeObjectURL(downloadUrl);

		statusEl.textContent = "PDF успешно сформирован и скачан.";
	} catch (error) {
		statusEl.textContent = error.message;
	}
});
