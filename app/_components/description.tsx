export type tDescriptionProp = {
    videoUrl: string,
    title: string,
    description: string,
    captions?: string,
}
export default function description({ videoUrl, title, description, captions }: tDescriptionProp) {
  return (
    <div>
        <video width="320" height="240" controls preload="none">
            <source src={videoUrl} type="video/mp4" />
            { captions && <track
                src={captions}
                kind="subtitles"
                srcLang="en"
                label="English"
            />}
        Your browser does not support the video tag.
        </video>
        <h3>title:{title}</h3>
        <h4>description:{description}</h4>
    </div>
  )
}
