<div align="center">

# Parametric Trajectory Distillation for Few-Step Video Generation

**Lan Feng**<sup>1,2</sup> &nbsp; **Peter Karkus**<sup>2</sup> &nbsp; **Maximilian Igl**<sup>2</sup> &nbsp; **Julius Berner**<sup>2</sup> &nbsp; **Yuxiao Chen**<sup>2</sup><br>
**Shuhan Tan**<sup>2</sup> &nbsp; **Alexandre Alahi**<sup>1</sup> &nbsp; **Boris Ivanovic**<sup>2</sup> &nbsp; **Marco Pavone**<sup>2,3</sup>

<sup>1</sup>EPFL &nbsp;&nbsp; <sup>2</sup>NVIDIA &nbsp;&nbsp; <sup>3</sup>Stanford University

[**Project page**](https://alan-lanfeng.github.io/PTD/) &nbsp;·&nbsp; **Paper** (coming soon) &nbsp;·&nbsp; **Code** (coming soon) &nbsp;·&nbsp; [**Citation**](#citation)

</div>

**PTD is a few-step distillation method for video diffusion and flow models.** One student evaluation predicts a whole
denoising segment as a polynomial curve. The teacher is queried on that curve, and a single least-squares loss trains
the student. At inference only the segment's mean velocity is used, so the distilled model keeps the teacher's
architecture.

This repository hosts the project page; the code will be released separately.

## Project page

`docs/` is a static site served by GitHub Pages. To preview it locally:

```bash
npx http-server docs -p 8000 -a 127.0.0.1 -c-1   # then open http://localhost:8000
```

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

- Videos: generated with MiniMax-H3 and Wan2.1, subject to the licenses of those models.
- Fonts: Newsreader and Inter Tight, SIL Open Font License 1.1 ([`docs/media/fonts/OFL.txt`](docs/media/fonts/OFL.txt)).
- Music, all under the Mixkit Stock Music Free License: "Sonor #2" by Eugenio Mininni (project film); "Classical 7", "Fun and Games" and
  "Little Bells" (The Open Window); "Skyline" by Eugenio Mininni (Pebble No. 47).
- The Open Window is adapted from the short story by Saki (1914), in the public domain.
