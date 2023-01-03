import sys
import os
import requests
import json
from bs4 import BeautifulSoup


class Client:
    def __init__(self, id, pw):
        self.id = id
        self.pw = pw
        self.session = requests.Session()

    def login(self):
        self.session.headers.update(
            {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
            }
        )
        res = self.session.post(
            url="https://sso.suwings.syu.ac.kr/LoginServlet",
            params={"method": "idpwProcessEx", "ssid": 42},
            data={"login_div": "sso", "id": self.id, "pw": self.pw},
        )
        reTry = BeautifulSoup(res.content, "lxml", from_encoding="utf-8").find("input", {"name": "reTry"}).get("value")
        if reTry == "N":
            return True
        else:
            return False

    def get_todo_list(self, output=None):
        res = self.session.get(url="https://lms.suwings.syu.ac.kr/ilos/mp/todo_list.acl")
        bsObject = BeautifulSoup(res.content, "lxml", from_encoding="utf-8")
        data = bsObject.find_all("div", {"class": "todo_wrap"})
        list = []
        for d in data:
            if d.find("input", {"value": "lecture_weeks"}):
                title = "".join(d.find("div", {"class": "todo_title"}).text.split())
                subjt = "".join(d.find("div", {"class": "todo_subjt"}).text.split())
                dday = "".join(d.find("span", {"class": "todo_d_day"}).text.split())
                script = d["onclick"]
                id = script.split("'")[1]
                new_title = f"[{dday}]{subjt:15s}\t{title}"
                week = {"course": {"title": new_title, "id": id}, "complete": False, "script": script}
                list.append(week)
                if output:
                    output.emit(new_title)
        self.todo = list
        return list

    def close(self):
        self.session.close()


if __name__ == "__main__":
    client = Client(sys.argv[1], sys.argv[2])
    client.login()
    print(json.dumps(client.get_todo_list()), end="")
    client.close()
