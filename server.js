import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import axios from "axios";
import { JSDOM } from "jsdom";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function analyzeHtml(html, checkedUrl) {
  const dom = new JSDOM(html, {
    includeNodeLocations: true,
    url: checkedUrl
  });

  const { document } = dom.window;

  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;

  const failures = [];

  // Проверка для тега img (проверка 1)
  const images = document.querySelectorAll("img");
  for (const img of images) {
    totalChecks++;
    const ariaHidden = img.getAttribute("aria-hidden");
    
    const alt = img.getAttribute("alt");
    const ariaLabel = img.getAttribute("aria-label");
    const ariaLabeledby = img.getAttribute("aria-labelledby");
    const ariaDescribedby = img.getAttribute("aria-describedby");
    
    let isValid = false;
    
    if (alt || ariaLabel) {
      isValid = true;
    } else if (ariaLabeledby) {
      const labelElement = document.getElementById(ariaLabeledby);
      isValid = labelElement && labelElement.textContent.trim() !== '';
    } else if (ariaDescribedby) {
      const describedElement = document.getElementById(ariaDescribedby);
      isValid = describedElement && describedElement.textContent.trim() !== '';
    }

    if (isValid) {
      passedChecks++;
    } else {
      failedChecks++;
      const location = dom.nodeLocation(img);
      failures.push({
        tag: "img",
        column: location?.startCol ?? null,
        message: 1
      });
    }
  }

  // Проверка для тега div (проверка 2)
  const divs = document.querySelectorAll("div");
  for (const div of divs) {
    totalChecks++;
    const ariaHidden = div.getAttribute("aria-hidden");
    const role = div.getAttribute("role");
    
    const ariaLabel = div.getAttribute("aria-label");
    const ariaLabeledby = div.getAttribute("aria-labelledby");
    
    let isValid = false;
    
    if (ariaLabel && ariaLabel.trim() !== '') {
      isValid = true;
    } else if (ariaLabeledby) {
      const labelElement = document.getElementById(ariaLabeledby);
      isValid = labelElement && labelElement.textContent.trim() !== '';
    }
    
    if (isValid) {
      passedChecks++;
    } else {
      failedChecks++;
      const location = dom.nodeLocation(div);
      failures.push({
        tag: "div",
        column: location?.startCol ?? null,
        message: 2
      });
    }
  }

  // Проверка для тега span (проверка 3)
  const spans = document.querySelectorAll("span");
  for (const span of spans) {
    totalChecks++;
    const ariaHidden = span.getAttribute("aria-hidden");
    const role = span.getAttribute("role");
    
    const ariaLabel = span.getAttribute("aria-label");
    const ariaLabeledby = span.getAttribute("aria-labelledby");
    
    let isValid = false;
    
    if (ariaLabel && ariaLabel.trim() !== '') {
      isValid = true;
    } else if (ariaLabeledby) {
      const labelElement = document.getElementById(ariaLabeledby);
      isValid = labelElement && labelElement.textContent.trim() !== '';
    }
    
    if (isValid) {
      passedChecks++;
    } else {
      failedChecks++;
      const location = dom.nodeLocation(span);
      failures.push({
        tag: "span",
        column: location?.startCol ?? null,
        message: 3
      });
    }
  }

  // Проверка для тега figure (проверка 4)
const figures = document.querySelectorAll("figure");
for (const figure of figures) {
  totalChecks++;
  const ariaHidden = figure.getAttribute("aria-hidden");
  
  const figcaption = figure.querySelector("figcaption");
  let isValid = false;
  
  if (figcaption && figcaption.textContent.trim() !== '') {
    isValid = true;
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(figure);
    failures.push({
      tag: "figure",
      column: location?.startCol ?? null,
      message: 4
    });
  }
}

// Проверка для тега video (проверка 5)
const videos = document.querySelectorAll("video");
for (const video of videos) {
  totalChecks++;
  const ariaHidden = video.getAttribute("aria-hidden");
  
  const hasTrack = video.querySelector("track[kind]") !== null;
  const ariaLabel = video.getAttribute("aria-label");
  const ariaLabeledby = video.getAttribute("aria-labelledby");
  const ariaDescribedby = video.getAttribute("aria-describedby");
  
  let isValid = false;
  
  if (hasTrack) {
    if (ariaLabel && ariaLabel.trim() !== '') {
      isValid = true;
    } else if (ariaLabeledby) {
      const labelElement = document.getElementById(ariaLabeledby);
      isValid = labelElement && labelElement.textContent.trim() !== '';
    } else if (ariaDescribedby) {
      const describedElement = document.getElementById(ariaDescribedby);
      isValid = describedElement && describedElement.textContent.trim() !== '';
    }
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(video);
    failures.push({
      tag: "video",
      column: location?.startCol ?? null,
      message: 5
    });
  }
}
// Проверка для тега object (проверка 6)
const objects = document.querySelectorAll("object");
for (const obj of objects) {
  totalChecks++;
  const ariaHidden = obj.getAttribute("aria-hidden");
  
  const ariaLabel = obj.getAttribute("aria-label");
  const ariaLabeledby = obj.getAttribute("aria-labelledby");
  const ariaDescribedby = obj.getAttribute("aria-describedby");
  
  let isValid = false;
  
  if (ariaLabel && ariaLabel.trim() !== '') {
    isValid = true;
  } else if (ariaLabeledby) {
    const labelElement = document.getElementById(ariaLabeledby);
    isValid = labelElement && labelElement.textContent.trim() !== '';
  } else if (ariaDescribedby) {
    const describedElement = document.getElementById(ariaDescribedby);
    isValid = describedElement && describedElement.textContent.trim() !== '';
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(obj);
    failures.push({
      tag: "object",
      column: location?.startCol ?? null,
      message: 6
    });
  }
}

// Проверка для тега audio (проверка 7)
const audios = document.querySelectorAll("audio");
for (const audio of audios) {
  totalChecks++;
  const ariaHidden = audio.getAttribute("aria-hidden");
  
  const hasTrack = audio.querySelector("track[kind]") !== null;
  const ariaLabel = audio.getAttribute("aria-label");
  const ariaLabeledby = audio.getAttribute("aria-labelledby");
  const ariaDescribedby = audio.getAttribute("aria-describedby");
  
  let isValid = false;
  
  if (hasTrack) {
    if (ariaLabel && ariaLabel.trim() !== '') {
      isValid = true;
    } else if (ariaLabeledby) {
      const labelElement = document.getElementById(ariaLabeledby);
      isValid = labelElement && labelElement.textContent.trim() !== '';
    } else if (ariaDescribedby) {
      const describedElement = document.getElementById(ariaDescribedby);
      isValid = describedElement && describedElement.textContent.trim() !== '';
    }
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(audio);
    failures.push({
      tag: "audio",
      column: location?.startCol ?? null,
      message: 7
    });
  }
}

// Проверка для тега canvas (проверка 8)
const canvases = document.querySelectorAll("canvas");
for (const canvas of canvases) {
  totalChecks++;
  const ariaHidden = canvas.getAttribute("aria-hidden");
  
  const canvasText = canvas.textContent.trim();
  const ariaLabel = canvas.getAttribute("aria-label");
  const ariaLabeledby = canvas.getAttribute("aria-labelledby");
  const ariaDescribedby = canvas.getAttribute("aria-describedby");
  
  let isValid = false;
  
  if (canvasText !== '') {
    if (ariaLabel && ariaLabel.trim() !== '') {
      isValid = true;
    } else if (ariaLabeledby) {
      const labelElement = document.getElementById(ariaLabeledby);
      isValid = labelElement && labelElement.textContent.trim() !== '';
    } else if (ariaDescribedby) {
      const describedElement = document.getElementById(ariaDescribedby);
      isValid = describedElement && describedElement.textContent.trim() !== '';
    }
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(canvas);
    failures.push({
      tag: "canvas",
      column: location?.startCol ?? null,
      message: 8
    });
  }
}

// Проверка для тега form (проверка 9)
const forms = document.querySelectorAll("form");
for (const form of forms) {
  totalChecks++;
  const ariaHidden = form.getAttribute("aria-hidden");
  
  const ariaLabel = form.getAttribute("aria-label");
  const ariaLabeledby = form.getAttribute("aria-labelledby");
  
  let isValid = false;
  
  if (ariaLabel && ariaLabel.trim() !== '') {
    isValid = true;
  } else if (ariaLabeledby) {
    const labelElement = document.getElementById(ariaLabeledby);
    isValid = labelElement && labelElement.textContent.trim() !== '';
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(form);
    failures.push({
      tag: "form",
      column: location?.startCol ?? null,
      message: 9
    });
  }
}

// Проверка для тега input (проверка 10)
const inputs = document.querySelectorAll("input");
for (const input of inputs) {
  totalChecks++;
  const ariaHidden = input.getAttribute("aria-hidden");
  
  const ariaLabel = input.getAttribute("aria-label");
  const ariaLabeledby = input.getAttribute("aria-labelledby");
  
  let isValid = false;
  
  if (ariaLabel && ariaLabel.trim() !== '') {
    isValid = true;
  } else if (ariaLabeledby) {
    const labelElement = document.getElementById(ariaLabeledby);
    isValid = labelElement && labelElement.textContent.trim() !== '';
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(input);
    failures.push({
      tag: "input",
      column: location?.startCol ?? null,
      message: 10
    });
  }
}

// Проверка для тега textarea (проверка 11)
const textareas = document.querySelectorAll("textarea");
for (const textarea of textareas) {
  totalChecks++;
  const ariaHidden = textarea.getAttribute("aria-hidden");
  
  const ariaLabel = textarea.getAttribute("aria-label");
  const ariaLabeledby = textarea.getAttribute("aria-labelledby");
  
  let isValid = false;
  
  if (ariaLabel && ariaLabel.trim() !== '') {
    isValid = true;
  } else if (ariaLabeledby) {
    const labelElement = document.getElementById(ariaLabeledby);
    isValid = labelElement && labelElement.textContent.trim() !== '';
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(textarea);
    failures.push({
      tag: "textarea",
      column: location?.startCol ?? null,
      message: 11
    });
  }
}

// Проверка для тега button (проверка 12)
const buttons = document.querySelectorAll("button");
for (const button of buttons) {
  totalChecks++;
  const ariaHidden = button.getAttribute("aria-hidden");
  
  const ariaLabel = button.getAttribute("aria-label");
  const ariaLabeledby = button.getAttribute("aria-labelledby");
  
  let isValid = false;
  
  if (ariaLabel && ariaLabel.trim() !== '') {
    isValid = true;
  } else if (ariaLabeledby) {
    const labelElement = document.getElementById(ariaLabeledby);
    isValid = labelElement && labelElement.textContent.trim() !== '';
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(button);
    failures.push({
      tag: "button",
      column: location?.startCol ?? null,
      message: 12
    });
  }
}

// Проверка для тега select (проверка 13)
const selects = document.querySelectorAll("select");
for (const select of selects) {
  totalChecks++;
  const ariaHidden = select.getAttribute("aria-hidden");
  
  const ariaLabel = select.getAttribute("aria-label");
  const ariaLabeledby = select.getAttribute("aria-labelledby");
  
  let isValid = false;
  
  if (ariaLabel && ariaLabel.trim() !== '') {
    isValid = true;
  } else if (ariaLabeledby) {
    const labelElement = document.getElementById(ariaLabeledby);
    isValid = labelElement && labelElement.textContent.trim() !== '';
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(select);
    failures.push({
      tag: "select",
      column: location?.startCol ?? null,
      message: 13
    });
  }
}

// Проверка для тега option (проверка 14)
const options = document.querySelectorAll("option");
for (const option of options) {
  totalChecks++;
  const ariaHidden = option.getAttribute("aria-hidden");
  
  const ariaLabel = option.getAttribute("aria-label");
  const ariaLabeledby = option.getAttribute("aria-labelledby");
  
  let isValid = false;
  
  if (ariaLabel && ariaLabel.trim() !== '') {
    isValid = true;
  } else if (ariaLabeledby) {
    const labelElement = document.getElementById(ariaLabeledby);
    isValid = labelElement && labelElement.textContent.trim() !== '';
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(option);
    failures.push({
      tag: "option",
      column: location?.startCol ?? null,
      message: 14
    });
  }
}

// Проверка для тега fieldset (проверка 15)
const fieldsets = document.querySelectorAll("fieldset");
for (const fieldset of fieldsets) {
  totalChecks++;
  const ariaHidden = fieldset.getAttribute("aria-hidden");
  
  const legend = fieldset.querySelector("legend");
  const ariaLabel = fieldset.getAttribute("aria-label");
  const ariaLabeledby = fieldset.getAttribute("aria-labelledby");
  
  let isValid = false;
  
  if (legend && legend.textContent.trim() !== '') {
    if (ariaLabel && ariaLabel.trim() !== '') {
      isValid = true;
    } else if (ariaLabeledby) {
      const labelElement = document.getElementById(ariaLabeledby);
      isValid = labelElement && labelElement.textContent.trim() !== '';
    }
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(fieldset);
    failures.push({
      tag: "fieldset",
      column: location?.startCol ?? null,
      message: 15
    });
  }
}

// Проверка для тега progress (проверка 16)
const progresses = document.querySelectorAll("progress");
for (const progress of progresses) {
  totalChecks++;
  const ariaHidden = progress.getAttribute("aria-hidden");
  
  const ariaLabel = progress.getAttribute("aria-label");
  const ariaLabeledby = progress.getAttribute("aria-labelledby");
  
  let isValid = false;
  
  if (ariaLabel && ariaLabel.trim() !== '') {
    isValid = true;
  } else if (ariaLabeledby) {
    const labelElement = document.getElementById(ariaLabeledby);
    isValid = labelElement && labelElement.textContent.trim() !== '';
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(progress);
    failures.push({
      tag: "progress",
      column: location?.startCol ?? null,
      message: 16
    });
  }
}

// Проверка для тега embed (проверка 17)
const embeds = document.querySelectorAll("embed");
for (const embed of embeds) {
  totalChecks++;
  const ariaHidden = embed.getAttribute("aria-hidden");
  
  const ariaLabel = embed.getAttribute("aria-label");
  const ariaLabeledby = embed.getAttribute("aria-labelledby");
  const ariaDescribedby = embed.getAttribute("aria-describedby");
  
  let isValid = false;
  
  if (ariaLabel && ariaLabel.trim() !== '') {
    isValid = true;
  } else if (ariaLabeledby) {
    const labelElement = document.getElementById(ariaLabeledby);
    isValid = labelElement && labelElement.textContent.trim() !== '';
  } else if (ariaDescribedby) {
    const describedElement = document.getElementById(ariaDescribedby);
    isValid = describedElement && describedElement.textContent.trim() !== '';
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(embed);
    failures.push({
      tag: "embed",
      column: location?.startCol ?? null,
      message: 17
    });
  }
}

// Проверка для тега iframe (проверка 18)
const iframes = document.querySelectorAll("iframe");
for (const iframe of iframes) {
  totalChecks++;
  const ariaHidden = iframe.getAttribute("aria-hidden");
  
  const title = iframe.getAttribute("title");
  const sandbox = iframe.getAttribute("sandbox");
  const ariaLabel = iframe.getAttribute("aria-label");
  const ariaLabeledby = iframe.getAttribute("aria-labelledby");
  
  let isValid = false;
  
  if (
    title && title.trim() !== '' &&
    sandbox && ['allow-same-origin', 'allow-scripts', 'allow-top-navigation'].every(value => sandbox.includes(value)) &&
    iframe.textContent.trim() !== ''
  ) {
    if (ariaLabel && ariaLabel.trim() !== '') {
      isValid = true;
    } else if (ariaLabeledby) {
      const labelElement = document.getElementById(ariaLabeledby);
      isValid = labelElement && labelElement.textContent.trim() !== '';
    }
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(iframe);
    failures.push({
      tag: "iframe",
      column: location?.startCol ?? null,
      message: 18
    });
  }
}

// Проверка для тега link (проверка 19)
const links = document.querySelectorAll("link");
for (const link of links) {
  totalChecks++;
  const ariaHidden = link.getAttribute("aria-hidden");
  
  const title = link.getAttribute("title");
  const ariaLabel = link.getAttribute("aria-label");
  const ariaLabeledby = link.getAttribute("aria-labelledby");
  
  let isValid = false;
  
  if (title && title.trim() !== '') {
    isValid = true;
  } else if (ariaLabel && ariaLabel.trim() !== '') {
    isValid = true;
  } else if (ariaLabeledby) {
    const labelElement = document.getElementById(ariaLabeledby);
    isValid = labelElement && labelElement.textContent.trim() !== '';
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(link);
    failures.push({
      tag: "link",
      column: location?.startCol ?? null,
      message: 19
    });
  }
}

// Проверка для тега a (проверка 20)
const anchors = document.querySelectorAll("a");
for (const anchor of anchors) {
  totalChecks++;
  const ariaHidden = anchor.getAttribute("aria-hidden");
  
  const ariaLabel = anchor.getAttribute("aria-label");
  const ariaLabeledby = anchor.getAttribute("aria-labelledby");
  
  let isValid = false;
  
  if (ariaLabel && ariaLabel.trim() !== '') {
    isValid = true;
  } else if (ariaLabeledby) {
    const labelElement = document.getElementById(ariaLabeledby);
    isValid = labelElement && labelElement.textContent.trim() !== '';
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(anchor);
    failures.push({
      tag: "a",
      column: location?.startCol ?? null,
      message: 20
    });
  }
}

// Проверка для тега div (проверка 21)
const divss = document.querySelectorAll("div");
for (const div of divss) {
  totalChecks++;
  const role = div.getAttribute("role");
  
  const ariaLevel = div.getAttribute("aria-level");
  
  let isValid = false;
  
  if (ariaLevel && ariaLevel.trim() !== '') {
    isValid = true;
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(div);
    failures.push({
      tag: "div",
      column: location?.startCol ?? null,
      message: 21
    });
  }
}

// Проверка для тега video (проверка 22)
const videoss = document.querySelectorAll("video");
for (const video of videoss) {
  totalChecks++;
  const autoplay = video.getAttribute("autoplay");
  
  let isValid = true;
  
  if (autoplay) {
    isValid = false;
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(video);
    failures.push({
      tag: "video",
      column: location?.startCol ?? null,
      message: 22
    });
  }
}

// Проверка для тега audio (проверка 23)
const audioss = document.querySelectorAll("audio");
for (const audio of audioss) {
  totalChecks++;
  const autoplay = audio.getAttribute("autoplay");
  
  let isValid = true;
  
  if (autoplay) {
    isValid = false;
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(audio);
    failures.push({
      tag: "audio",
      column: location?.startCol ?? null,
      message: 23
    });
  }
}

// Проверка для тега html (проверка 24)
const htmls = document.querySelector("html");
if (htmls) {
  totalChecks++;
  
  const head = document.head;
  const title = head?.querySelector("title");
  
  let isValid = false;
  
  if (title && title.textContent.trim() !== '') {
    isValid = true;
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(htmls);
    failures.push({
      tag: "html",
      column: location?.startCol ?? null,
      message: 24
    });
  }
}

// Проверка для input type=range (проверка 25)
const inputss = document.querySelectorAll("input[type='range']");
for (const input of inputss) {
  totalChecks++;
  
  const type = input.getAttribute("type");
  const min = input.getAttribute("min");
  const max = input.getAttribute("max");
  const value = input.getAttribute("value");
  const step = input.getAttribute("step");
  
  let isValid = true;
  
  if (type === 'range' && min && max && value) {
    if (!step || step.trim() === '') {
      isValid = false;
    }
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(input);
    failures.push({
      tag: "input",
      column: location?.startCol ?? null,
      message: 25
    });
  }
}

// Проверка для html lang (проверка 26)
const htm = document.querySelector("html");
if (htm) {
  totalChecks++;
  
  const lang = htm.getAttribute("lang");
  
  let isValid = false;
  
  if (lang && lang.trim() !== '') {
    isValid = true;
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(htm);
    failures.push({
      tag: "html",
      column: location?.startCol ?? null,
      message: 26
    });
  }
}

// Проверка для input required в форме (проверка 27)
const formInputs = document.querySelectorAll("form input[required]");
for (const input of formInputs) {
  totalChecks++;
  
  const required = input.getAttribute("required");
  const ariaRequired = input.getAttribute("aria-required");
  
  let isValid = false;
  
  if (required) {
    if (ariaRequired === 'true') {
      isValid = true;
    }
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(input);
    failures.push({
      tag: "input",
      column: location?.startCol ?? null,
      message: 27
    });
  }
}

// Проверка для textarea required в форме (проверка 28)
const formTextareas = document.querySelectorAll("form textarea[required]");
for (const textarea of formTextareas) {
  totalChecks++;
  
  const required = textarea.getAttribute("required");
  const ariaRequired = textarea.getAttribute("aria-required");
  
  let isValid = false;
  
  if (required) {
    if (ariaRequired === 'true') {
      isValid = true;
    }
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(textarea);
    failures.push({
      tag: "textarea",
      column: location?.startCol ?? null,
      message: 28
    });
  }
}

// Проверка для select required в форме (проверка 29)
const formSelects = document.querySelectorAll("form select[required]");
for (const select of formSelects) {
  totalChecks++;
  
  const required = select.getAttribute("required");
  const ariaRequired = select.getAttribute("aria-required");
  
  let isValid = false;
  
  if (required) {
    if (ariaRequired === 'true') {
      isValid = true;
    }
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(select);
    failures.push({
      tag: "select",
      column: location?.startCol ?? null,
      message: 29
    });
  }
}

// Проверка для input name и autocomplete (проверка 30)
const inputsss = document.querySelectorAll("input");
for (const input of inputsss) {
  totalChecks++;
  
  const name = input.getAttribute("name");
  const autocomplete = input.getAttribute("autocomplete");
  
  let isValid = false;
  
  if (name && name.trim() !== '' && autocomplete && autocomplete.trim() !== '') {
    isValid = true;
  }
  
  if (isValid) {
    passedChecks++;
  } else {
    failedChecks++;
    const location = dom.nodeLocation(input);
    failures.push({
      tag: "input",
      column: location?.startCol ?? null,
      message: 30
    });
  }
}

  const successRate =
    totalChecks === 0 ? 100 : Math.round((passedChecks / totalChecks) * 100);

  return {
    checkedUrl,
    totalChecks,
    passedChecks,
    failedChecks,
    successRate,
    failures
  };
}

function buildPdf(report, res) {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const filename = "report.pdf";
  const fontPath = path.join(__dirname, "public", "fonts", "DejaVuSans.ttf");

  if (!fs.existsSync(fontPath)) {
    throw new Error(`Шрифт не найден: ${fontPath}`);
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  doc.pipe(res);
  doc.font(fontPath);

  doc.fontSize(20).text("Отчёт по проверке HTML", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`URL: ${report.checkedUrl}`);
  doc.text(`Всего проверок: ${report.totalChecks}`);
  doc.text(`Успешных: ${report.passedChecks}`);
  doc.text(`Неуспешных: ${report.failedChecks}`);
  doc.text(`Процент успешных проверок: ${report.successRate}%`);
  doc.text("Документация логики проверок:");
  doc.text('Ссылка на документ', {
    link: 'https://docs.google.com/document/d/1XP8PwSlz9eApskQ6nfU7lHmTsaZMTaMAB5raIS3eTFo/edit?usp=sharing',
    underline: true
  });
  doc.moveDown();

  doc.fontSize(16).text("Неуспешные проверки");
  doc.moveDown(0.5);

  if (report.failures.length === 0) {
    doc.fontSize(12).text("Ошибок не найдено.");
  } else {
    report.failures.forEach((failure, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. Тег: <${failure.tag}>, колонка: ${failure.column ?? "неизвестно"}`
        );

      doc.fontSize(12).text(`Ошибка: ${failure.message}`);
      doc.moveDown(0.5);
    });
  }

  doc.end();
}

app.post("/api/analyze", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !isValidUrl(url)) {
      return res.status(400).json({
        error: "Некорректный URL"
      });
    }

    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 AccessibilityCheckerMVP/1.0"
      }
    });

    const html = response.data;

    if (typeof html !== "string") {
      return res.status(400).json({
        error: "По указанному URL не удалось получить HTML"
      });
    }

    const report = analyzeHtml(html, url);
    buildPdf(report, res);
  } catch (error) {
    console.error(error);

    if (res.headersSent) {
      return;
    }

    return res.status(500).json({
      error: `Ошибка при анализе страницы или генерации PDF: ${error.message}`
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});