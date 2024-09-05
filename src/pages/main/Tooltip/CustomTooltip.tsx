import Tooltip from "@mui/material/Tooltip";
import React from "react";
import "../main.css";
interface CustomTooltipProps {
  likes: number | undefined;
  usernames: string[] | undefined;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  likes,
  usernames,
}) => {
  return (
    <div style={{ padding: "20px" }}>
      <Tooltip
        title={
          <div>
            {usernames && usernames.length > 0 ? (
              <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {usernames.map((username, index) => (
                  <li key={index}>{username}</li>
                ))}
              </ul>
            ) : (
              <span>No likes yet</span>
            )}
          </div>
        }
        arrow
      >
        <div className="likes-text">
          {likes != undefined && <p className="post-likes"> Likes :{likes}</p>}
        </div>
      </Tooltip>
    </div>
  );
};
