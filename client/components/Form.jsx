export default function Form({ toggler, setState }) {
  async function updateState(e) {
    const roomId = new URLSearchParams(window.location.search).get("roomid");
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await fetch("/api/rooms", {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ updates: Object.fromEntries(formData), roomId }),
      });
      toggler();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <form onSubmit={updateState}>
      <div className="close">
        <i
          className="fa fa-times-circle"
          aria-hidden="true"
          onClick={toggler}
          style={{
            cursor: "pointer",
          }}
        ></i>
      </div>
      <input
        type="text"
        placeholder="Room topic"
        name="jam-room-topic"
        autoComplete="off"
      />
      <br />
      <div>
        Pick a topic to talk about. <span>(optional)</span>
      </div>
      <br />
      <textarea name="jam-room-description"></textarea>
      <div>
        Describe what this room is about.{" "}
        <span>
          (optional) (supports{" "}
          <a
            className="underline"
            href="https://www.markdownguide.org/cheat-sheet/"
            target="_blank"
            rel="noreferrer"
          >
            Markdown
          </a>
          )
        </span>{" "}
      </div>
      <div>
        <br />
        <input
          type="text"
          placeholder="Logo URI"
          name="jam-room-logo-uri"
          autoComplete="off"
        />
        <div>
          Set the URI for your logo. <span>(optional)</span>
        </div>
        <br />
        <input type="color" name="jam-room-color" autoComplete="off" />
        <div>
          Set primary color for your Room. <span>(optional)</span>
        </div>
        <br />
        <input
          type="text"
          placeholder="Button URI"
          name="jam-room-button-uri"
          autoComplete="off"
        />
        <div>
          Set the link for the 'call to action' button. <span>(optional)</span>
        </div>
        <br />
        <input
          type="text"
          placeholder="Button Text"
          name="jam-room-button-text"
          autoComplete="off"
        />
        <div>
          Set the text for the 'call to action' button. <span>(optional)</span>
        </div>
        <br />
        <input
          type="text"
          placeholder="Share URL"
          name="jam-room-share-url"
          autoComplete="off"
        />
        <div>
          The URL used for sharing the room.
          <span>(optional)</span>
        </div>
        <br />
      </div>
      <div>
        <div className="buttons">
          <button type="submit">Update Room</button>
          <button>Cancel</button>
        </div>
      </div>
    </form>
  );
}
