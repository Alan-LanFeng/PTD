# Parametric Trajectory Distillation (PTD)

Few-step distillation for video and sound.

Lan Feng<sup>1,2</sup>, Peter Karkus<sup>2</sup>, Maximilian Igl<sup>2</sup>, Julius Berner<sup>2</sup>, Yuxiao Chen<sup>3</sup>,
Shuhan Tan<sup>2</sup>, Alexandre Alahi<sup>1</sup>, Boris Ivanovic<sup>2</sup>, Marco Pavone<sup>2</sup>

<sup>1</sup>EPFL, <sup>2</sup>NVIDIA, <sup>3</sup>California Institute of Technology

**[Project page](https://alan-lanfeng.github.io/PTD/)** · Paper (coming soon) · Code (coming soon) · Weights (coming soon)

## Overview

PTD distills a many-step video generator into a four-step or six-step student. Each student step predicts a curved, polynomial segment of
the teacher's trajectory and is trained against the teacher's velocity read along the student's own predicted path; at inference each step
jumps straight to the segment's end point. With a single LoRA on MiniMax-H3, a 33B model that generates video and sound together, a
five-second 1344×768 clip with sound takes 31 s in four steps or 46 s in six, instead of 343 s for the 50-step teacher.

The code and weights will be released in this repository.

## Repository layout

- `docs/`: the project website, served by GitHub Pages. It is a static site with relative paths and no external requests.

## Preview the website locally

Open `docs/index.html` directly, or serve the folder:

```bash
npx http-server docs -p 8000
```

Then open http://localhost:8000. `python3 -m http.server` also works, but it does not support byte-range requests, so the film's chapter
buttons cannot seek there.

## Citation

```bibtex
@misc{feng2026ptd,
  title  = {Parametric Trajectory Distillation for Few-Step Video Generation},
  author = {Feng, Lan and Karkus, Peter and Igl, Maximilian and Berner, Julius and Chen, Yuxiao and
            Tan, Shuhan and Alahi, Alexandre and Ivanovic, Boris and Pavone, Marco},
  year   = {2026},
  note   = {Under review}
}
```

## Third-party assets

- Fonts: Newsreader and Inter Tight, under the SIL Open Font License 1.1 ([`docs/media/fonts/OFL.txt`](docs/media/fonts/OFL.txt)).
- Film music: "Sonor #2" by Eugenio Mininni, Mixkit Stock Music Free License.
